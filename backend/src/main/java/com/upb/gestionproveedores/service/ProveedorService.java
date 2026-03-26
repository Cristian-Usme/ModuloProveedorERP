package com.upb.gestionproveedores.service;

import com.upb.gestionproveedores.dto.request.ProveedorRequest;
import com.upb.gestionproveedores.dto.response.ProveedorResponse;
import com.upb.gestionproveedores.exception.BusinessException;
import com.upb.gestionproveedores.exception.ResourceNotFoundException;
import com.upb.gestionproveedores.model.Proveedor;
import com.upb.gestionproveedores.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public Page<ProveedorResponse> listar(String search, Pageable pageable) {
        return proveedorRepository.findBySearch(search, pageable).map(this::toResponse);
    }

    public ProveedorResponse obtenerPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ProveedorResponse crear(ProveedorRequest request) {
        if (proveedorRepository.existsByRucNit(request.getRucNit())) {
            throw new BusinessException("Ya existe un proveedor con RUC/NIT: " + request.getRucNit());
        }
        Proveedor proveedor = Proveedor.builder()
            .nombre(request.getNombre()).rucNit(request.getRucNit())
            .email(request.getEmail()).telefono(request.getTelefono())
            .direccion(request.getDireccion()).build();
        return toResponse(proveedorRepository.save(proveedor));
    }

    @Transactional
    public ProveedorResponse actualizar(Long id, ProveedorRequest request) {
        Proveedor proveedor = findById(id);
        proveedor.setNombre(request.getNombre());
        proveedor.setEmail(request.getEmail());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setDireccion(request.getDireccion());
        return toResponse(proveedorRepository.save(proveedor));
    }

    @Transactional
    public void eliminar(Long id) {
        Proveedor proveedor = findById(id);
        proveedor.setActivo(false);
        proveedorRepository.save(proveedor);
    }

    public Proveedor findById(Long id) {
        return proveedorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Proveedor", id));
    }

    private ProveedorResponse toResponse(Proveedor p) {
        return ProveedorResponse.builder()
            .id(p.getId()).nombre(p.getNombre()).rucNit(p.getRucNit())
            .email(p.getEmail()).telefono(p.getTelefono()).direccion(p.getDireccion())
            .calificacionPromedio(p.getCalificacionPromedio())
            .totalCalificaciones(p.getTotalCalificaciones())
            .activo(p.getActivo()).creadoEn(p.getCreadoEn()).build();
    }
}
