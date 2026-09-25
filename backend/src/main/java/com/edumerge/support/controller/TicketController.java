package com.edumerge.support.controller;

import com.edumerge.support.dto.request.*;
import com.edumerge.support.dto.response.*;
import com.edumerge.support.security.UserDetailsImpl;
import com.edumerge.support.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<PagedResponse<TicketSummaryResponse>> getTickets(TicketFilterRequest filter,
                                                                          @PageableDefault(size = 20) Pageable pageable,
                                                                          @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.getTickets(filter, pageable, user.getUser().getId(), user.getUser().getRole()));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketCreateRequest request,
                                                       @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.createTicket(request, user.getUser().getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.getTicket(id, user.getUser().getId(), user.getUser().getRole()));
    }

    @PutMapping("/{id}/transition")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TicketResponse> transitionStatus(@PathVariable Long id, @Valid @RequestBody TransitionRequest req,
                                                           @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.transitionStatus(id, req.getTargetStatus(), req.getReason(), user.getUser().getId()));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TicketResponse> assignTicket(@PathVariable Long id, @Valid @RequestBody AssignRequest req,
                                                       @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.assignTicket(id, req.getStaffId(), user.getUser().getId()));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<TicketResponse> resolveTicket(@PathVariable Long id, @Valid @RequestBody ResolveRequest req,
                                                        @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.resolveTicket(id, req, user.getUser().getId()));
    }
}
