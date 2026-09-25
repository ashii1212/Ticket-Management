package com.edumerge.support.service;

import com.edumerge.support.dto.request.*;
import com.edumerge.support.dto.response.*;
import com.edumerge.support.enums.Role;
import com.edumerge.support.enums.SlaStatus;
import com.edumerge.support.enums.TicketStatus;
import com.edumerge.support.entity.Ticket;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TicketService {
    TicketResponse createTicket(TicketCreateRequest request, Long studentId);
    TicketResponse transitionStatus(Long ticketId, TicketStatus targetStatus, String reason, Long actorId);
    TicketResponse assignTicket(Long ticketId, Long staffId, Long actorId);
    CommentResponse addComment(Long ticketId, CommentCreateRequest request, Long actorId, Role role);
    TicketResponse resolveTicket(Long ticketId, ResolveRequest request, Long actorId);
    TicketResponse escalateTicket(Long ticketId, EscalateRequest request, Long actorId);
    SlaStatus calculateSlaStatus(Ticket ticket);
    void runEscalationCheck();
    List<CommentResponse> getComments(Long ticketId, Long actorId, Role role);
    TicketResponse getTicket(Long ticketId, Long actorId, Role role);
    PagedResponse<TicketSummaryResponse> getTickets(TicketFilterRequest filter, Pageable pageable, Long actorId, Role role);
}
