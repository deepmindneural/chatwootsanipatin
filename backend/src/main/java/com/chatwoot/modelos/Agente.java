package com.chatwoot.modelos;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "agentes")
public class Agente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idChatwoot;
    
    private String nombre;
    
    private String email;
    
    private String avatar;
    
    private boolean disponible;
    
    @OneToMany(mappedBy = "agente")
    private List<Conversacion> conversaciones = new ArrayList<>();
}
