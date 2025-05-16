package com.chatwoot.modelos;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "conversaciones")
public class Conversacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idChatwoot;
    
    private String numeroTelefono;
    
    private String nombreContacto;
    
    @Enumerated(EnumType.STRING)
    private EstadoConversacion estado;
    
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
    
    @OneToMany(mappedBy = "conversacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Mensaje> mensajes = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "conversacion_etiquetas",
        joinColumns = @JoinColumn(name = "conversacion_id"),
        inverseJoinColumns = @JoinColumn(name = "etiqueta_id")
    )
    private List<Etiqueta> etiquetas = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "agente_id")
    private Agente agente;
    
    public enum EstadoConversacion {
        ABIERTA,
        RESUELTA,
        PENDIENTE
    }
}
