package com.upb.gestionproveedores.dto.response;

import com.upb.gestionproveedores.model.EstadoOrden;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdenCompraResponse {
    private Long id;
    private String numeroOrden;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private EstadoOrden estado;
    private String observaciones;
    private BigDecimal total;
    private Long proveedorId;
    private String proveedorNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private List<DetalleOrdenResponse> detalles;
}
