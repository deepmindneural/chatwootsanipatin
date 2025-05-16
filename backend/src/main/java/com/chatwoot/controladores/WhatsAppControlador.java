package com.chatwoot.controladores;

import com.chatwoot.dto.MensajeDTO;
import com.chatwoot.integraciones.whatsapp.ServicioWhatsApp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
@Tag(name = "WhatsApp API", description = "Endpoints para la integración con WhatsApp Business API")
public class WhatsAppControlador {

    private final ServicioWhatsApp servicioWhatsApp;
    
    @Operation(summary = "Enviar mensaje de WhatsApp", description = "Envía un mensaje de texto a un número de WhatsApp específico")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Mensaje enviado correctamente", 
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MensajeDTO.class))
        ),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos", content = @Content),
        @ApiResponse(responseCode = "500", description = "Error en el servidor", content = @Content)
    })
    @PostMapping("/enviar")
    public ResponseEntity<MensajeDTO> enviarMensaje(
            @Parameter(description = "Datos del mensaje a enviar", required = true)
            @RequestBody Map<String, String> datos) {
        String numeroDestino = datos.get("numeroDestino");
        String contenido = datos.get("contenido");
        
        if (numeroDestino == null || numeroDestino.isBlank() || contenido == null || contenido.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        MensajeDTO mensaje = servicioWhatsApp.enviarMensajeWhatsApp(numeroDestino, contenido);
        
        if (mensaje == null) {
            return ResponseEntity.internalServerError().build();
        }
        
        return ResponseEntity.ok(mensaje);
    }
    
    @Operation(summary = "Recibir webhook de WhatsApp", description = "Procesa eventos entrantes de WhatsApp (mensajes, confirmaciones de entrega, etc.)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Webhook procesado correctamente"),
        @ApiResponse(responseCode = "500", description = "Error procesando el webhook", content = @Content)
    })
    @PostMapping("/webhook")
    public ResponseEntity<String> recibirWebhook(
            @Parameter(description = "Payload del webhook", required = true)
            @RequestBody Map<String, Object> payload) {
        log.info("Webhook de WhatsApp recibido");
        
        servicioWhatsApp.procesarMensajeEntrante(payload);
        
        return ResponseEntity.ok("Webhook procesado correctamente");
    }
    
    @Operation(summary = "Verificar webhook de WhatsApp", description = "Verifica el webhook para la integración con WhatsApp Business API (proceso de verificación requerido por Meta/WhatsApp)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verificación exitosa - devuelve el challenge"),
        @ApiResponse(responseCode = "400", description = "Verificación fallida - token inválido o modo incorrecto", content = @Content)
    })
    @GetMapping("/webhook")
    public ResponseEntity<String> verificarWebhook(
            @Parameter(description = "Modo de verificación (debe ser 'subscribe')", required = true)
            @RequestParam("hub.mode") String mode,
            @Parameter(description = "Token de verificación para autenticar la solicitud", required = true)
            @RequestParam("hub.verify_token") String token,
            @Parameter(description = "Challenge que debe devolverse para completar la verificación", required = true)
            @RequestParam("hub.challenge") String challenge) {
        
        log.info("Verificación de webhook de WhatsApp");
        
        // Verificar token (en una implementación real, esto se compararía con un valor configurado)
        String tokenEsperado = "token_verificacion_whatsapp";
        
        if ("subscribe".equals(mode) && tokenEsperado.equals(token)) {
            return ResponseEntity.ok(challenge);
        }
        
        return ResponseEntity.badRequest().body("Verificación fallida");
    }
}
