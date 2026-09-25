package com.edumerge.support.dto.request;

import com.edumerge.support.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransitionRequest {
    @NotNull
    private TicketStatus targetStatus;
    private String reason;
}
