package com.chatwoot.webhooks;

import com.chatwoot.integraciones.whatsapp.ServicioWhatsApp;
import com.chatwoot.modelos.Conversacion;
import com.chatwoot.modelos.Mensaje;
import com.chatwoot.repositorios.ConversacionRepositorio;
import com.chatwoot.repositorios.MensajeRepositorio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhooks/chatwoot")
@RequiredArgsConstructor
@Slf4j
public class ChatwootWebhookControlador {

    private final ConversacionRepositorio conversacionRepositorio;
    private final MensajeRepositorio mensajeRepositorio;
    private final ServicioWhatsApp servicioWhatsApp;
    
    @Value("${chatwoot.webhook.token}")
    private String webhookToken;
    
    @PostMapping
    public ResponseEntity<String> procesarWebhook(
            @RequestHeader("X-Chatwoot-Webhook-Hmac") String hmac,
            @RequestBody Map<String, Object> payload) {
        
        log.info("Webhook de Chatwoot recibido");
        
        // Verificar que el hmac es válido (en una implementación real)
        // Si no es válido, retornar error
        // if (!verificarHmac(payload, hmac, webhookToken)) {
        //     return ResponseEntity.badRequest().body("HMAC inválido");
        // }
        
        String tipoEvento = (String) payload.get("event");
        
        switch (tipoEvento) {
            case "message_created":
                procesarMensajeCreado(payload);
                break;
            case "conversation_status_changed":
                procesarCambioEstadoConversacion(payload);
                break;
            case "conversation_assignment_changed":
                procesarCambioAsignacionConversacion(payload);
                break;
            default:
                log.info("Evento no procesado: {}", tipoEvento);
        }
        
        return ResponseEntity.ok("Webhook procesado correctamente");
    }
    
    private void procesarMensajeCreado(Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> datosMensaje = (Map<String, Object>) payload.get("message");
            @SuppressWarnings("unchecked")
            Map<String, Object> datosConversacion = (Map<String, Object>) payload.get("conversation");
            
            Long idConversacionChatwoot = Long.valueOf(datosConversacion.get("id").toString());
            Long idMensajeChatwoot = Long.valueOf(datosMensaje.get("id").toString());
            String contenido = (String) datosMensaje.get("content");
            String tipoMensaje = (String) datosMensaje.get("message_type");
            
            // Verificar si el mensaje ya existe
            if (mensajeRepositorio.findByIdChatwoot(idMensajeChatwoot).isPresent()) {
                log.info("Mensaje ya procesado previamente: {}", idMensajeChatwoot);
                return;
            }
            
            // Buscar la conversación
            Optional<Conversacion> conversacionOpt = conversacionRepositorio.findByIdChatwoot(idConversacionChatwoot);
            
            if (conversacionOpt.isPresent()) {
                Conversacion conversacion = conversacionOpt.get();
                
                // Crear nuevo mensaje
                Mensaje mensaje = new Mensaje();
                mensaje.setIdChatwoot(idMensajeChatwoot);
                mensaje.setConversacion(conversacion);
                mensaje.setContenido(contenido);
                mensaje.setTipo(Mensaje.TipoMensaje.TEXTO); // Simplificado, podría determinarse mejor
                mensaje.setFechaEnvio(LocalDateTime.now());
                
                // Determinar dirección del mensaje
                if ("outgoing".equals(tipoMensaje)) {
                    mensaje.setDireccion(Mensaje.DireccionMensaje.SALIENTE);
                    mensaje.setLeido(true);
                    
                    // Enviar a WhatsApp si es mensaje saliente
                    servicioWhatsApp.enviarMensajeWhatsApp(conversacion.getNumeroTelefono(), contenido);
                } else {
                    mensaje.setDireccion(Mensaje.DireccionMensaje.ENTRANTE);
                    mensaje.setLeido(false);
                }
                
                mensajeRepositorio.save(mensaje);
                
                // Actualizar fecha de la conversación
                conversacion.setFechaActualizacion(LocalDateTime.now());
                conversacionRepositorio.save(conversacion);
            } else {
                log.warn("Conversación no encontrada: {}", idConversacionChatwoot);
            }
        } catch (Exception e) {
            log.error("Error al procesar mensaje de Chatwoot: {}", e.getMessage());
        }
    }
    
    private void procesarCambioEstadoConversacion(Map<String, Object> payload) {
        try {
            Map<String, Object> datosConversacion = (Map<String, Object>) payload.get("conversation");
            
            Long idConversacionChatwoot = Long.valueOf(datosConversacion.get("id").toString());
            String nuevoEstado = (String) datosConversacion.get("status");
            
            Optional<Conversacion> conversacionOpt = conversacionRepositorio.findByIdChatwoot(idConversacionChatwoot);
            
            if (conversacionOpt.isPresent()) {
                Conversacion conversacion = conversacionOpt.get();
                
                // Actualizar estado
                switch (nuevoEstado) {
                    case "open":
                        conversacion.setEstado(Conversacion.EstadoConversacion.ABIERTA);
                        break;
                    case "resolved":
                        conversacion.setEstado(Conversacion.EstadoConversacion.RESUELTA);
                        break;
                    case "pending":
                        conversacion.setEstado(Conversacion.EstadoConversacion.PENDIENTE);
                        break;
                }
                
                conversacion.setFechaActualizacion(LocalDateTime.now());
                conversacionRepositorio.save(conversacion);
            }
        } catch (Exception e) {
            log.error("Error al procesar cambio de estado: {}", e.getMessage());
        }
    }
    
    private void procesarCambioAsignacionConversacion(Map<String, Object> payload) {
        // Esta implementación dependería de cómo se manejen los agentes en tu sistema
        log.info("Cambio de asignación procesado");
    }
    
    // Método para verificar el HMAC (en una implementación real)
    // Este método se implementará en el futuro cuando se active la verificación de seguridad
    @SuppressWarnings("unused")
    private boolean verificarHmac(Map<String, Object> payload, String hmacRecibido, String token) {
        // Aquí iría la lógica para verificar el HMAC usando el token configurado
        // Por ejemplo, usando HmacUtils de Apache Commons Codec
        return true; // Simplificado para este ejemplo
    }
}
