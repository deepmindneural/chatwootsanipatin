package com.chatwoot.repositorios;

import com.chatwoot.modelos.Agente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AgenteRepositorio extends JpaRepository<Agente, Long> {
    
    Optional<Agente> findByIdChatwoot(Long idChatwoot);
    
    Optional<Agente> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
