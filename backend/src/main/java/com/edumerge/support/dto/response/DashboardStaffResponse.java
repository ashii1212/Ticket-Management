package com.edumerge.support.dto.response;

import lombok.Data;

@Data
public class DashboardStaffResponse {
    private long myAssignedCount;
    private long unassignedCount;
    private long dueSoonCount;
    private long breachedCount;
    private long pendingStudentCount;
    private long escalatedCount;
}
