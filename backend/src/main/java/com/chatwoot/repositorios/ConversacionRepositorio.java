package com.chatwoot.repositorios;

import com.chatwoot.modelos.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ConversacionRepositorio extends JpaRepository<Conversacion, Long> {
    
    Optional<Conversacion> findByIdChatwoot(Long idChatwoot);
    
    Optional<Conversacion> findByNumeroTelefono(String numeroTelefono);
    
    List<Conversacion> findByEstado(Conversacion.EstadoConversacion estado);
    
    List<Conversacion> findByAgenteId(Long agenteId);
}
