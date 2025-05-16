package com.chatwoot.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MensajeDTO {
    
    private Long id;
    
    private Long idChatwoot;
    
    private Long conversacionId;
    
    private String contenido;
    
    private String tipo;
    
    private LocalDateTime fechaEnvio;
    
    private boolean leido;
    
    private String direccion;
    
    private String idExterno;
    
    private String metadatos;
}
