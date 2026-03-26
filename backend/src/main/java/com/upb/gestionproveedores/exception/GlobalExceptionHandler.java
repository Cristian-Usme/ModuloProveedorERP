package com.upb.gestionproveedores.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value()).error("Not Found")
            .message(ex.getMessage()).path(req.getRequestURI()).build());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorResponse.builder()
            .status(HttpStatus.CONFLICT.value()).error("Conflict")
            .message(ex.getMessage()).path(req.getRequestURI()).build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<String> details = ex.getBindingResult().getFieldErrors()
            .stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value()).error("Validation Error")
            .message("Error de validación en los datos enviados")
            .path(req.getRequestURI()).details(details).build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
            .status(HttpStatus.FORBIDDEN.value()).error("Forbidden")
            .message("No tiene permisos para realizar esta acción")
            .path(req.getRequestURI()).build());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse.builder()
            .status(HttpStatus.UNAUTHORIZED.value()).error("Unauthorized")
            .message("Email o contraseña incorrectos")
            .path(req.getRequestURI()).build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value()).error("Internal Server Error")
            .message("Error interno del servidor: " + ex.getMessage())
            .path(req.getRequestURI()).build());
    }
}
