package com.upb.gestionproveedores.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        log.warn("[404] Recurso no encontrado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .path(req.getRequestURI())
            .timestamp(System.currentTimeMillis())
            .build());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex, HttpServletRequest req) {
        log.warn("[409] Error de negocio: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorResponse.builder()
            .status(HttpStatus.CONFLICT.value())
            .error("Conflict")
            .message(ex.getMessage())
            .path(req.getRequestURI())
            .timestamp(System.currentTimeMillis())
            .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
        log.warn("[400] Error de validación: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Error")
            .message("Error de validación en los datos enviados")
            .path(req.getRequestURI())
            .details(errors)
            .timestamp(System.currentTimeMillis())
            .build());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest req) {
        String message = "Error de integridad de datos";
        if (ex.getMessage().contains("ruc_nit")) {
            message = "El RUC/NIT ya está registrado en el sistema";
        } else if (ex.getMessage().contains("email")) {
            message = "El email ya está registrado en el sistema";
        }
        log.warn("[409] Error de integridad: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorResponse.builder()
            .status(HttpStatus.CONFLICT.value())
            .error("Integrity Violation")
            .message(message)
            .path(req.getRequestURI())
            .timestamp(System.currentTimeMillis())
            .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        log.warn("[403] Acceso denegado");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
            .status(HttpStatus.FORBIDDEN.value())
            .error("Forbidden")
            .message("No tiene permisos para realizar esta acción")
            .path(req.getRequestURI())
            .timestamp(System.currentTimeMillis())
            .build());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        log.warn("[401] Credenciales inválidas");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse.builder()
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("Unauthorized")
            .message("Email o contraseña incorrectos")
            .path(req.getRequestURI())
            .timestamp(System.currentTimeMillis())
            .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest req, WebRequest request) {
        log.error("[500] Error interno del servidor", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("Ha ocurrido un error interno. Por favor contacte al administrador.")
            .path(req.getRequestURI())
            .timestamp(System.currentTimeMillis())
            .build());
    }
}
