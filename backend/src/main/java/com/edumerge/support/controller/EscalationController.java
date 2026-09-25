package com.edumerge.support.controller;

import com.edumerge.support.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/escalations")
@RequiredArgsConstructor
public class EscalationController {

    private final TicketService ticketService;

    @PostMapping("/run")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> runEscalationCheck() {
        ticketService.runEscalationCheck();
        return ResponseEntity.ok().build();
    }
}
