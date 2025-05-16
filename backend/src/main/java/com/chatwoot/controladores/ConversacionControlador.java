package com.chatwoot.controladores;

import com.chatwoot.dto.ConversacionDTO;
import com.chatwoot.dto.MensajeDTO;
import com.chatwoot.servicios.ChatwootServicio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Conversaciones", description = "Gestión de conversaciones con clientes a través de Chatwoot")
public class ConversacionControlador {

    private final ChatwootServicio chatwootServicio;
    
    @Operation(summary = "Obtener todas las conversaciones", description = "Recupera todas las conversaciones activas desde Chatwoot")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Lista de conversaciones recuperada con éxito", 
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
                array = @ArraySchema(schema = @Schema(implementation = ConversacionDTO.class)))
        )
    })
    @GetMapping
    public ResponseEntity<List<ConversacionDTO>> obtenerConversaciones() {
        return ResponseEntity.ok(chatwootServicio.obtenerConversaciones());
    }
    
    @Operation(summary = "Crear una nueva conversación", description = "Crea una nueva conversación en Chatwoot para un contacto de WhatsApp")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Conversación creada con éxito", 
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ConversacionDTO.class))
        ),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos", content = @Content),
        @ApiResponse(responseCode = "500", description = "Error en el servidor", content = @Content)
    })
    @PostMapping
    public ResponseEntity<ConversacionDTO> crearConversacion(
            @Parameter(description = "Datos para crear la conversación (numeroTelefono y nombreContacto)", required = true)
            @RequestBody Map<String, String> datos) {
        String numeroTelefono = datos.get("numeroTelefono");
        String nombreContacto = datos.get("nombreContacto");
        
        if (numeroTelefono == null || numeroTelefono.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (nombreContacto == null || nombreContacto.isBlank()) {
            nombreContacto = "Usuario " + numeroTelefono;
        }
        
        ConversacionDTO conversacion = chatwootServicio.crearConversacion(numeroTelefono, nombreContacto);
        return ResponseEntity.ok(conversacion);
    }
    
    @Operation(summary = "Enviar mensaje en una conversación", description = "Envía un mensaje a través de Chatwoot a una conversación existente")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Mensaje enviado con éxito", 
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MensajeDTO.class))
        ),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos", content = @Content),
        @ApiResponse(responseCode = "404", description = "Conversación no encontrada", content = @Content),
        @ApiResponse(responseCode = "500", description = "Error en el servidor", content = @Content)
    })
    @PostMapping("/{idConversacionChatwoot}/mensajes")
    public ResponseEntity<MensajeDTO> enviarMensaje(
            @Parameter(description = "ID de la conversación en Chatwoot", required = true)
            @PathVariable Long idConversacionChatwoot,
            @Parameter(description = "Datos del mensaje a enviar (contenido)", required = true)
            @RequestBody Map<String, String> datos) {
        
        String contenido = datos.get("contenido");
        
        if (contenido == null || contenido.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        MensajeDTO mensaje = chatwootServicio.enviarMensaje(idConversacionChatwoot, contenido);
        
        if (mensaje == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mensaje);
    }
}
