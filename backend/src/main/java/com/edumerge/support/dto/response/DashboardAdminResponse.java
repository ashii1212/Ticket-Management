package com.edumerge.support.dto.response;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardAdminResponse {
    private long totalTickets;
    private Map<String, Long> byStatus;
    private Map<String, Long> byPriority;
    private Map<String, Long> byCategory;
    private Map<String, Long> byStaff;
    private double slaCompliancePercentage;
    private long escalatedCount;
}
