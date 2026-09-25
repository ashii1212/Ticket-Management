package com.edumerge.support.dto.response;

import com.edumerge.support.enums.Priority;
import com.edumerge.support.enums.SlaStatus;
import com.edumerge.support.enums.TicketStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketResponse {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private String studentName;
    private Long studentId;
    private String categoryName;
    private Priority priority;
    private TicketStatus status;
    private String assignedStaffName;
    private Long assignedStaffId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime slaDeadline;
    private SlaStatus slaStatus;
    private String resolutionNote;
    private String pendingReason;
}
