package com.upb.gestionproveedores.repository;

import com.upb.gestionproveedores.model.EstadoOrden;
import com.upb.gestionproveedores.model.OrdenCompra;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {

    @Query("SELECT o FROM OrdenCompra o WHERE " +
           "(:estado IS NULL OR o.estado = :estado) AND " +
           "(:usuarioId IS NULL OR o.usuario.id = :usuarioId)")
    Page<OrdenCompra> findByEstadoAndUsuario(EstadoOrden estado, Long usuarioId, Pageable pageable);
}
