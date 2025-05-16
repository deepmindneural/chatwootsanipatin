package com.chatwoot.dto;

import lombok.Data;

@Data
public class AgenteDTO {
    
    private Long id;
    
    private Long idChatwoot;
    
    private String nombre;
    
    private String email;
    
    private String avatar;
    
    private boolean disponible;
}
