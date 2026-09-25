package com.edumerge.support.dto.request;

import com.edumerge.support.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketCreateRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private Long categoryId;
    @NotNull
    private Priority requestedPriority;
}
