package com.upb.gestionproveedores.service;

import com.upb.gestionproveedores.dto.request.ProductoRequest;
import com.upb.gestionproveedores.dto.response.ProductoResponse;
import com.upb.gestionproveedores.exception.ResourceNotFoundException;
import com.upb.gestionproveedores.model.Producto;
import com.upb.gestionproveedores.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProveedorService proveedorService;

    public Page<ProductoResponse> listar(String search, Pageable pageable) {
        return productoRepository.findBySearch(search, pageable).map(this::toResponse);
    }

    public ProductoResponse obtenerPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = Producto.builder()
            .nombre(request.getNombre()).descripcion(request.getDescripcion())
            .precioReferencia(request.getPrecioReferencia()).unidad(request.getUnidad())
            .proveedor(proveedorService.findById(request.getProveedorId()))
            .build();
        return toResponse(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = findById(id);
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecioReferencia(request.getPrecioReferencia());
        producto.setUnidad(request.getUnidad());
        producto.setProveedor(proveedorService.findById(request.getProveedorId()));
        return toResponse(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = findById(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public Producto findById(Long id) {
        return productoRepository.findById(id)
            .filter(Producto::getActivo)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
    }

    private ProductoResponse toResponse(Producto p) {
        return ProductoResponse.builder()
            .id(p.getId()).nombre(p.getNombre()).descripcion(p.getDescripcion())
            .precioReferencia(p.getPrecioReferencia()).unidad(p.getUnidad())
            .proveedorId(p.getProveedor().getId()).proveedorNombre(p.getProveedor().getNombre())
            .activo(p.getActivo()).creadoEn(p.getCreadoEn()).build();
    }
}
