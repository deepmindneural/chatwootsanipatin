package com.chatwoot.repositorios;

import com.chatwoot.modelos.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MensajeRepositorio extends JpaRepository<Mensaje, Long> {
    
    Optional<Mensaje> findByIdChatwoot(Long idChatwoot);
    
    List<Mensaje> findByConversacionId(Long conversacionId);
    
    List<Mensaje> findByConversacionIdAndDireccion(Long conversacionId, Mensaje.DireccionMensaje direccion);
    
    Optional<Mensaje> findByIdExterno(String idExterno);
}
