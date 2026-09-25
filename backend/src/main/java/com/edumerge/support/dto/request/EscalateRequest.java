package com.edumerge.support.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EscalateRequest {
    @NotBlank
    private String reason;
}
