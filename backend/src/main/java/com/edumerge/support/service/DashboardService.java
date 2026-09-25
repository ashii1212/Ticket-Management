package com.edumerge.support.service;

import com.edumerge.support.dto.response.*;

public interface DashboardService {
    DashboardStudentResponse getStudentDashboard(Long studentId);
    DashboardStaffResponse getStaffDashboard(Long staffId);
    DashboardAdminResponse getAdminDashboard();
}
