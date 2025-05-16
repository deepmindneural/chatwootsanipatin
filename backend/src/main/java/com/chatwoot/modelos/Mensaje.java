package com.chatwoot.modelos;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "mensajes")
public class Mensaje {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idChatwoot;
    
    @ManyToOne
    @JoinColumn(name = "conversacion_id")
    private Conversacion conversacion;
    
    @Column(columnDefinition = "TEXT")
    private String contenido;
    
    @Enumerated(EnumType.STRING)
    private TipoMensaje tipo;
    
    private LocalDateTime fechaEnvio;
    
    private boolean leido;
    
    @Enumerated(EnumType.STRING)
    private DireccionMensaje direccion;
    
    private String idExterno;
    
    @Column(columnDefinition = "TEXT")
    private String metadatos;
    
    public enum TipoMensaje {
        TEXTO,
        IMAGEN,
        AUDIO,
        VIDEO,
        DOCUMENTO,
        UBICACION,
        CONTACTO,
        PLANTILLA
    }
    
    public enum DireccionMensaje {
        ENTRANTE,
        SALIENTE
    }
}
