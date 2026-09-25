package com.edumerge.support.dto.response;

import com.edumerge.support.enums.Priority;
import com.edumerge.support.enums.SlaStatus;
import com.edumerge.support.enums.TicketStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketSummaryResponse {
    private Long id;
    private String ticketNumber;
    private String title;
    private String studentName;
    private String categoryName;
    private Priority priority;
    private TicketStatus status;
    private String assignedStaffName;
    private LocalDateTime updatedAt;
    private SlaStatus slaStatus;
}
