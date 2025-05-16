package com.chatwoot.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ConversacionDTO {
    
    private Long id;
    
    private Long idChatwoot;
    
    private String numeroTelefono;
    
    private String nombreContacto;
    
    private String estado;
    
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
    
    private List<MensajeDTO> mensajes = new ArrayList<>();
    
    private List<EtiquetaDTO> etiquetas = new ArrayList<>();
    
    private AgenteDTO agente;
}
