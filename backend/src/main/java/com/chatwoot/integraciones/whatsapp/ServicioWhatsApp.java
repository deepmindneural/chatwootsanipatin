package com.chatwoot.integraciones.whatsapp;

import com.chatwoot.dto.MensajeDTO;
import com.chatwoot.modelos.Conversacion;
import com.chatwoot.modelos.Mensaje;
import com.chatwoot.repositorios.ConversacionRepositorio;
import com.chatwoot.repositorios.MensajeRepositorio;
import com.chatwoot.servicios.ChatwootServicio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.BodyInserters;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServicioWhatsApp {

    private final WebClient whatsappWebClient;
    private final ConversacionRepositorio conversacionRepositorio;
    private final MensajeRepositorio mensajeRepositorio;
    private final ChatwootServicio chatwootServicio;
    
    @Value("${whatsapp.360dialog.numero.telefono}")
    private String numeroTelefono;
    
    @Value("${whatsapp.proveedor}")
    private String proveedor;
    
    public MensajeDTO enviarMensajeWhatsApp(String numeroDestino, String contenido) {
        if (!numeroDestino.startsWith("+")) {
            numeroDestino = "+" + numeroDestino;
        }
        
        String idExterno = UUID.randomUUID().toString();
        
        if ("360dialog".equals(proveedor)) {
            return enviarMensaje360Dialog(numeroDestino, contenido, idExterno);
        } else if ("twilio".equals(proveedor)) {
            // Implementación para Twilio
            log.info("Envío de mensajes por Twilio no implementado");
            return null;
        } else {
            log.error("Proveedor de WhatsApp no soportado: {}", proveedor);
            return null;
        }
    }
    
    private MensajeDTO enviarMensaje360Dialog(String numeroDestino, String contenido, String idExterno) {
        Map<String, Object> mensajeRequest = Map.of(
            "to", numeroDestino,
            "type", "text",
            "text", Map.of("body", contenido),
            "preview_url", true,
            "recipient_type", "individual"
        );
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = whatsappWebClient.post()
                .uri("https://waba.360dialog.io/v1/messages")
                .body(BodyInserters.fromValue(mensajeRequest))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            
            // Guardamos el ID del mensaje para referencias futuras
            String idMensajeWhatsApp = (String) response.get("messages");
            log.info("Mensaje de WhatsApp enviado con ID: {}", idMensajeWhatsApp);
            
            // Buscar o crear conversación
            Optional<Conversacion> conversacionOpt = conversacionRepositorio.findByNumeroTelefono(numeroDestino);
            Conversacion conversacion;
            
            if (conversacionOpt.isPresent()) {
                conversacion = conversacionOpt.get();
            } else {
                // Crear conversación en Chatwoot y en nuestra BD
                String nombreContacto = obtenerNombreContacto(numeroDestino);
                nombreContacto = (nombreContacto != null && !nombreContacto.isEmpty()) ? nombreContacto : "Usuario " + numeroDestino;
                
                conversacion = new Conversacion();
                conversacion.setNumeroTelefono(numeroDestino);
                conversacion.setNombreContacto(nombreContacto);
                conversacion.setEstado(Conversacion.EstadoConversacion.ABIERTA);
                conversacion.setFechaCreacion(LocalDateTime.now());
                conversacion.setFechaActualizacion(LocalDateTime.now());
                
                // Crear en Chatwoot
                if (conversacion.getIdChatwoot() == null) {
                    try {
                        var chatwootConversacion = chatwootServicio.crearConversacion(numeroDestino, nombreContacto);
                        conversacion.setIdChatwoot(chatwootConversacion.getIdChatwoot());
                    } catch (Exception e) {
                        log.error("Error al crear la conversación en Chatwoot: {}", e.getMessage());
                    }
                }
                
                conversacionRepositorio.save(conversacion);
            }
            
            // Guardar mensaje enviado
            Mensaje mensaje = new Mensaje();
            mensaje.setConversacion(conversacion);
            mensaje.setContenido(contenido);
            mensaje.setTipo(Mensaje.TipoMensaje.TEXTO);
            mensaje.setDireccion(Mensaje.DireccionMensaje.SALIENTE);
            mensaje.setFechaEnvio(LocalDateTime.now());
            mensaje.setLeido(true);
            mensaje.setIdExterno(idExterno);
            
            if (conversacion.getIdChatwoot() != null) {
                try {
                    var chatwootMensaje = chatwootServicio.enviarMensaje(conversacion.getIdChatwoot(), contenido);
                    mensaje.setIdChatwoot(chatwootMensaje.getIdChatwoot());
                } catch (Exception e) {
                    log.error("Error al enviar mensaje a Chatwoot: {}", e.getMessage());
                }
            }
            
            mensajeRepositorio.save(mensaje);
            
            // Actualizar fecha de la conversación
            conversacion.setFechaActualizacion(LocalDateTime.now());
            conversacionRepositorio.save(conversacion);
            
            // Retornar DTO
            MensajeDTO dto = new MensajeDTO();
            dto.setId(mensaje.getId());
            dto.setIdChatwoot(mensaje.getIdChatwoot());
            dto.setConversacionId(conversacion.getId());
            dto.setContenido(mensaje.getContenido());
            dto.setTipo(mensaje.getTipo().name());
            dto.setDireccion(mensaje.getDireccion().name());
            dto.setFechaEnvio(mensaje.getFechaEnvio());
            dto.setIdExterno(mensaje.getIdExterno());
            
            return dto;
            
        } catch (Exception e) {
            log.error("Error al enviar mensaje por WhatsApp: {}", e.getMessage());
            return null;
        }
    }
    
    private String obtenerNombreContacto(String numero) {
        // En una implementación real, aquí se consultaría a un servicio de contactos o CRM
        return ""; // Por ahora retornamos vacío
    }
    
    public void procesarMensajeEntrante(Map<String, Object> payload) {
        try {
            if (payload.containsKey("statuses")) {
                // Procesar actualizaciones de estado
                return;
            }
            
            if (!payload.containsKey("messages")) {
                log.warn("Payload de WhatsApp no contiene mensajes");
                return;
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> mensajeData = (Map<String, Object>) ((java.util.List<?>) payload.get("messages")).get(0);
            String tipo = (String) mensajeData.get("type");
            String numeroOrigen = (String) mensajeData.get("from");
            String idMensaje = (String) mensajeData.get("id");
            
            // Buscar o crear conversación
            Optional<Conversacion> conversacionOpt = conversacionRepositorio.findByNumeroTelefono(numeroOrigen);
            Conversacion conversacion;
            
            if (conversacionOpt.isPresent()) {
                conversacion = conversacionOpt.get();
            } else {
                // Obtener información del contacto y crear conversación
                String nombreContacto = obtenerNombreContacto(numeroOrigen);
                nombreContacto = (nombreContacto != null && !nombreContacto.isEmpty()) ? nombreContacto : "Usuario " + numeroOrigen;
                
                // Crear conversación en Chatwoot
                var chatwootConversacion = chatwootServicio.crearConversacion(numeroOrigen, nombreContacto);
                
                conversacion = new Conversacion();
                conversacion.setIdChatwoot(chatwootConversacion.getIdChatwoot());
                conversacion.setNumeroTelefono(numeroOrigen);
                conversacion.setNombreContacto(nombreContacto);
                conversacion.setEstado(Conversacion.EstadoConversacion.ABIERTA);
                conversacion.setFechaCreacion(LocalDateTime.now());
                conversacion.setFechaActualizacion(LocalDateTime.now());
                
                conversacionRepositorio.save(conversacion);
            }
            
            // Procesar mensaje según su tipo
            String contenido = "";
            Mensaje.TipoMensaje tipoMensaje = Mensaje.TipoMensaje.TEXTO;
            
            switch (tipo) {
                case "text":
                    @SuppressWarnings("unchecked")
                    Map<String, Object> texto = (Map<String, Object>) mensajeData.get("text");
                    contenido = (String) texto.get("body");
                    break;
                case "image":
                    tipoMensaje = Mensaje.TipoMensaje.IMAGEN;
                    contenido = "Imagen recibida";
                    break;
                case "audio":
                    tipoMensaje = Mensaje.TipoMensaje.AUDIO;
                    contenido = "Audio recibido";
                    break;
                case "video":
                    tipoMensaje = Mensaje.TipoMensaje.VIDEO;
                    contenido = "Video recibido";
                    break;
                case "document":
                    tipoMensaje = Mensaje.TipoMensaje.DOCUMENTO;
                    contenido = "Documento recibido";
                    break;
                case "location":
                    tipoMensaje = Mensaje.TipoMensaje.UBICACION;
                    contenido = "Ubicación recibida";
                    break;
                default:
                    contenido = "Mensaje de tipo desconocido";
            }
            
            // Verificar si el mensaje ya existe
            if (mensajeRepositorio.findByIdExterno(idMensaje).isPresent()) {
                log.info("Mensaje ya procesado previamente: {}", idMensaje);
                return;
            }
            
            // Guardar mensaje recibido
            Mensaje mensaje = new Mensaje();
            mensaje.setConversacion(conversacion);
            mensaje.setContenido(contenido);
            mensaje.setTipo(tipoMensaje);
            mensaje.setDireccion(Mensaje.DireccionMensaje.ENTRANTE);
            mensaje.setFechaEnvio(LocalDateTime.now());
            mensaje.setLeido(false);
            mensaje.setIdExterno(idMensaje);
            
            // Enviar mensaje a Chatwoot
            if (conversacion.getIdChatwoot() != null) {
                try {
                    // Aquí se enviaría a Chatwoot, pero como es entrante, se envía desde WhatsApp
                    // directamente a Chatwoot en una implementación real.
                    // Este código es solo para cuando el webhook de WhatsApp llega primero a nuestro sistema.
                    log.info("Mensaje entrante de WhatsApp: {}", contenido);
                } catch (Exception e) {
                    log.error("Error al procesar mensaje para Chatwoot: {}", e.getMessage());
                }
            }
            
            mensajeRepositorio.save(mensaje);
            
            // Actualizar fecha de la conversación
            conversacion.setFechaActualizacion(LocalDateTime.now());
            conversacionRepositorio.save(conversacion);
            
        } catch (Exception e) {
            log.error("Error al procesar mensaje entrante de WhatsApp: {}", e.getMessage());
        }
    }
}
