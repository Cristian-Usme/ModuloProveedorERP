package com.upb.gestionproveedores.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    private Long timestamp;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private List<String> details;
}
