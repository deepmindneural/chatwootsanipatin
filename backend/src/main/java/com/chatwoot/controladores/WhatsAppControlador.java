package com.chatwoot.controladores;

import com.chatwoot.dto.MensajeDTO;
import com.chatwoot.integraciones.whatsapp.ServicioWhatsApp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class WhatsAppControlador {

    private final ServicioWhatsApp servicioWhatsApp;
    
    @PostMapping("/enviar")
    public ResponseEntity<MensajeDTO> enviarMensaje(@RequestBody Map<String, String> datos) {
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
    
    @PostMapping("/webhook")
    public ResponseEntity<String> recibirWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Webhook de WhatsApp recibido");
        
        servicioWhatsApp.procesarMensajeEntrante(payload);
        
        return ResponseEntity.ok("Webhook procesado correctamente");
    }
    
    @GetMapping("/webhook")
    public ResponseEntity<String> verificarWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
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
