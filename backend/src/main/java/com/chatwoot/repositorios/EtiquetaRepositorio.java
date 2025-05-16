package com.chatwoot.repositorios;

import com.chatwoot.modelos.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EtiquetaRepositorio extends JpaRepository<Etiqueta, Long> {
    
    Optional<Etiqueta> findByIdChatwoot(Long idChatwoot);
    
    Optional<Etiqueta> findByNombre(String nombre);
    
    boolean existsByNombre(String nombre);
}
