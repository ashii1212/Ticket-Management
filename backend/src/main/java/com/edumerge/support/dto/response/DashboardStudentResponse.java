package com.edumerge.support.dto.response;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DashboardStudentResponse {
    private Map<String, Long> ticketCountsByStatus;
    private List<TicketSummaryResponse> recentTickets;
}
