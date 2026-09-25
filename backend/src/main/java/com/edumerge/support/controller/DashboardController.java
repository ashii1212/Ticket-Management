package com.edumerge.support.controller;

import com.edumerge.support.dto.response.DashboardAdminResponse;
import com.edumerge.support.dto.response.DashboardStaffResponse;
import com.edumerge.support.dto.response.DashboardStudentResponse;
import com.edumerge.support.security.UserDetailsImpl;
import com.edumerge.support.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardStudentResponse> getStudentDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(userDetails.getUser().getId()));
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DashboardStaffResponse> getStaffDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(dashboardService.getStaffDashboard(userDetails.getUser().getId()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardAdminResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }
}
