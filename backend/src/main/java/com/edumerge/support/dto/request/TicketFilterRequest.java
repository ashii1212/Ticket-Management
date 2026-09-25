package com.edumerge.support.dto.request;

import com.edumerge.support.enums.Priority;
import com.edumerge.support.enums.SlaStatus;
import com.edumerge.support.enums.TicketStatus;
import lombok.Data;

@Data
public class TicketFilterRequest {
    private TicketStatus status;
    private Priority priority;
    private Long categoryId;
    private Long assigneeId;
    private SlaStatus slaStatus;
    private String search; // search by ticket number, title, student name
}
