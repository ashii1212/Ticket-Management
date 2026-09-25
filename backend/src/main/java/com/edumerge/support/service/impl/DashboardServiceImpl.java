package com.edumerge.support.service.impl;

import com.edumerge.support.dto.response.*;
import com.edumerge.support.enums.TicketStatus;
import com.edumerge.support.repository.TicketRepository;
import com.edumerge.support.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;

    @Override
    public DashboardStudentResponse getStudentDashboard(Long studentId) {
        DashboardStudentResponse res = new DashboardStudentResponse();
        Map<String, Long> counts = new HashMap<>();
        for (TicketStatus status : TicketStatus.values()) {
            counts.put(status.name(), ticketRepository.countByStudentIdAndStatus(studentId, status));
        }
        res.setTicketCountsByStatus(counts);
        return res;
    }

    @Override
    public DashboardStaffResponse getStaffDashboard(Long staffId) {
        DashboardStaffResponse res = new DashboardStaffResponse();
        res.setMyAssignedCount(ticketRepository.countByAssignedStaffId(staffId));
        res.setUnassignedCount(ticketRepository.countByAssignedStaffIsNull());
        return res;
    }

    @Override
    public DashboardAdminResponse getAdminDashboard() {
        DashboardAdminResponse res = new DashboardAdminResponse();
        res.setTotalTickets(ticketRepository.count());
        return res;
    }
}
