package com.chatwoot.controladores;

import com.chatwoot.dto.ConversacionDTO;
import com.chatwoot.dto.MensajeDTO;
import com.chatwoot.servicios.ChatwootServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConversacionControlador {

    private final ChatwootServicio chatwootServicio;
    
    @GetMapping
    public ResponseEntity<List<ConversacionDTO>> obtenerConversaciones() {
        return ResponseEntity.ok(chatwootServicio.obtenerConversaciones());
    }
    
    @PostMapping
    public ResponseEntity<ConversacionDTO> crearConversacion(@RequestBody Map<String, String> datos) {
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
    
    @PostMapping("/{idConversacionChatwoot}/mensajes")
    public ResponseEntity<MensajeDTO> enviarMensaje(
            @PathVariable Long idConversacionChatwoot,
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
