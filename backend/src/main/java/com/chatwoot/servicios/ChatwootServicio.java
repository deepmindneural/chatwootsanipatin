package com.chatwoot.servicios;

import com.chatwoot.dto.MensajeDTO;
import com.chatwoot.dto.ConversacionDTO;
import com.chatwoot.modelos.Conversacion;
import com.chatwoot.modelos.Mensaje;
import com.chatwoot.modelos.Agente;
import com.chatwoot.repositorios.ConversacionRepositorio;
import com.chatwoot.repositorios.MensajeRepositorio;
import com.chatwoot.repositorios.AgenteRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.BodyInserters;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatwootServicio {

    private final WebClient chatwootWebClient;
    private final ConversacionRepositorio conversacionRepositorio;
    private final MensajeRepositorio mensajeRepositorio;
    private final AgenteRepositorio agenteRepositorio;
    
    @Value("${chatwoot.cuenta.id}")
    private Long cuentaId;
    
    public ConversacionDTO crearConversacion(String numeroTelefono, String nombreContacto) {
        Map<String, Object> payload = Map.of(
            "source_id", numeroTelefono,
            "inbox_id", 1, // ID del buzón de WhatsApp
            "contact_inbox", Map.of(
                "source_id", numeroTelefono,
                "name", nombreContacto
            )
        );
        
        @SuppressWarnings("unchecked")
    Map<String, Object> response = chatwootWebClient.post()
            .uri("/api/v1/accounts/{accountId}/conversations", cuentaId)
            .body(BodyInserters.fromValue(payload))
            .retrieve()
            .bodyToMono(Map.class)
            .block();
        
        @SuppressWarnings("unchecked")
        Map<String, Object> chatData = (Map<String, Object>) response.get("conversation");
        Long conversacionId = Long.valueOf(chatData.get("id").toString());
        
        Conversacion conversacion = new Conversacion();
        conversacion.setIdChatwoot(conversacionId);
        conversacion.setNumeroTelefono(numeroTelefono);
        conversacion.setNombreContacto(nombreContacto);
        conversacion.setEstado(Conversacion.EstadoConversacion.ABIERTA);
        conversacion.setFechaCreacion(LocalDateTime.now());
        conversacion.setFechaActualizacion(LocalDateTime.now());
        
        conversacionRepositorio.save(conversacion);
        
        ConversacionDTO dto = new ConversacionDTO();
        dto.setId(conversacion.getId());
        dto.setIdChatwoot(conversacionId);
        dto.setNumeroTelefono(numeroTelefono);
        dto.setNombreContacto(nombreContacto);
        dto.setEstado(conversacion.getEstado().name());
        
        return dto;
    }
    
    public MensajeDTO enviarMensaje(Long idConversacionChatwoot, String contenido) {
        Map<String, Object> payload = Map.of(
            "content", contenido,
            "message_type", "outgoing",
            "private", false
        );
        
        @SuppressWarnings("unchecked")
    Map<String, Object> response = chatwootWebClient.post()
            .uri("/api/v1/accounts/{accountId}/conversations/{conversationId}/messages", cuentaId, idConversacionChatwoot)
            .body(BodyInserters.fromValue(payload))
            .retrieve()
            .bodyToMono(Map.class)
            .block();
        
        Optional<Conversacion> conversacionOpt = conversacionRepositorio.findByIdChatwoot(idConversacionChatwoot);
        
        if (conversacionOpt.isPresent()) {
            Conversacion conversacion = conversacionOpt.get();
            
            Mensaje mensaje = new Mensaje();
            mensaje.setIdChatwoot(Long.valueOf(response.get("id").toString()));
            mensaje.setConversacion(conversacion);
            mensaje.setContenido(contenido);
            mensaje.setTipo(Mensaje.TipoMensaje.TEXTO);
            mensaje.setDireccion(Mensaje.DireccionMensaje.SALIENTE);
            mensaje.setFechaEnvio(LocalDateTime.now());
            mensaje.setLeido(true);
            
            mensajeRepositorio.save(mensaje);
            
            conversacion.setFechaActualizacion(LocalDateTime.now());
            conversacionRepositorio.save(conversacion);
            
            MensajeDTO dto = new MensajeDTO();
            dto.setId(mensaje.getId());
            dto.setIdChatwoot(mensaje.getIdChatwoot());
            dto.setContenido(mensaje.getContenido());
            dto.setTipo(mensaje.getTipo().name());
            dto.setDireccion(mensaje.getDireccion().name());
            dto.setFechaEnvio(mensaje.getFechaEnvio());
            
            return dto;
        }
        
        return null;
    }
    
    public List<ConversacionDTO> obtenerConversaciones() {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> response = chatwootWebClient.get()
            .uri("/api/v1/accounts/{accountId}/conversations", cuentaId)
            .retrieve()
            .bodyToMono(List.class)
            .block();
        
        // Mapear y guardar las conversaciones obtenidas
        return response.stream()
            .map(this::mapearConversacion)
            .toList();
    }
    
    private ConversacionDTO mapearConversacion(Map<String, Object> data) {
        @SuppressWarnings("unchecked")
        Map<String, Object> meta = (Map<String, Object>) data.get("meta");
        @SuppressWarnings("unchecked")
        Map<String, Object> sender = (Map<String, Object>) meta.get("sender");
        @SuppressWarnings("unchecked")
        Map<String, Object> assignee = (Map<String, Object>) data.get("assignee");
        
        String numeroTelefono = String.valueOf(sender.get("phone_number"));
        String nombreContacto = String.valueOf(sender.get("name"));
        Long idChatwoot = Long.valueOf(data.get("id").toString());
        String estadoStr = String.valueOf(data.get("status"));
        
        Conversacion.EstadoConversacion estado;
        switch (estadoStr) {
            case "open":
                estado = Conversacion.EstadoConversacion.ABIERTA;
                break;
            case "resolved":
                estado = Conversacion.EstadoConversacion.RESUELTA;
                break;
            default:
                estado = Conversacion.EstadoConversacion.PENDIENTE;
        }
        
        // Actualizar o crear la conversación en la base de datos
        Optional<Conversacion> conversacionOpt = conversacionRepositorio.findByIdChatwoot(idChatwoot);
        Conversacion conversacion;
        
        if (conversacionOpt.isPresent()) {
            conversacion = conversacionOpt.get();
            conversacion.setEstado(estado);
            conversacion.setFechaActualizacion(LocalDateTime.now());
        } else {
            conversacion = new Conversacion();
            conversacion.setIdChatwoot(idChatwoot);
            conversacion.setNumeroTelefono(numeroTelefono);
            conversacion.setNombreContacto(nombreContacto);
            conversacion.setEstado(estado);
            conversacion.setFechaCreacion(LocalDateTime.now());
            conversacion.setFechaActualizacion(LocalDateTime.now());
        }
        
        // Asignar agente si existe
        if (assignee != null) {
            Long agenteIdChatwoot = Long.valueOf(assignee.get("id").toString());
            String nombre = String.valueOf(assignee.get("name"));
            String email = String.valueOf(assignee.get("email"));
            
            Optional<Agente> agenteOpt = agenteRepositorio.findByIdChatwoot(agenteIdChatwoot);
            Agente agente;
            
            if (agenteOpt.isPresent()) {
                agente = agenteOpt.get();
            } else {
                agente = new Agente();
                agente.setIdChatwoot(agenteIdChatwoot);
                agente.setNombre(nombre);
                agente.setEmail(email);
                agente.setDisponible(true);
                agenteRepositorio.save(agente);
            }
            
            conversacion.setAgente(agente);
        }
        
        conversacionRepositorio.save(conversacion);
        
        // Mapear a DTO
        ConversacionDTO dto = new ConversacionDTO();
        dto.setId(conversacion.getId());
        dto.setIdChatwoot(idChatwoot);
        dto.setNumeroTelefono(numeroTelefono);
        dto.setNombreContacto(nombreContacto);
        dto.setEstado(conversacion.getEstado().name());
        
        return dto;
    }
}
