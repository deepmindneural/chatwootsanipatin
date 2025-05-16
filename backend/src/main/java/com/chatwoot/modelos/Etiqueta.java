package com.chatwoot.modelos;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "etiquetas")
public class Etiqueta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long idChatwoot;
    
    private String nombre;
    
    private String color;
    
    @ManyToMany(mappedBy = "etiquetas")
    private List<Conversacion> conversaciones = new ArrayList<>();
}
