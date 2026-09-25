package com.edumerge.support.service.impl;

import com.edumerge.support.dto.request.*;
import com.edumerge.support.dto.response.*;
import com.edumerge.support.entity.*;
import com.edumerge.support.enums.*;
import com.edumerge.support.exception.InvalidTransitionException;
import com.edumerge.support.exception.NotFoundException;
import com.edumerge.support.exception.UnauthorizedException;
import com.edumerge.support.mapper.CommentMapper;
import com.edumerge.support.mapper.TicketMapper;
import com.edumerge.support.repository.*;
import com.edumerge.support.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import com.edumerge.support.specification.TicketSpecification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketCategoryRepository categoryRepository;
    private final SlaPolicyRepository slaPolicyRepository;
    private final TicketActivityRepository activityRepository;
    private final TicketCommentRepository commentRepository;
    private final EscalationRepository escalationRepository;
    private final AuditLogRepository auditLogRepository;
    private final TicketMapper ticketMapper;
    private final CommentMapper commentMapper;

    @Override
    @Transactional
    public TicketResponse createTicket(TicketCreateRequest request, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found"));
        TicketCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        Ticket ticket = new Ticket();
        ticket.setStudent(student);
        ticket.setCategory(category);
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getRequestedPriority());
        ticket.setStatus(TicketStatus.NEW);
        
        // SLA Policy
        SlaPolicy sla = slaPolicyRepository.findByPriority(request.getRequestedPriority())
                .orElseGet(() -> {
                    SlaPolicy defaultSla = new SlaPolicy();
                    defaultSla.setResolutionHours(24);
                    return defaultSla;
                });
        ticket.setSlaDeadline(LocalDateTime.now().plusHours(sla.getResolutionHours()));
        ticket.setLastStatusChangeAt(LocalDateTime.now());
        
        // Note: thread safe DB sequence logic will be handled by DB or trigger, but for now we generate simple unique ID
        ticket.setTicketNumber("EDU-" + LocalDateTime.now().getYear() + "-" + System.currentTimeMillis() % 1000000);

        Ticket saved = ticketRepository.save(ticket);
        
        logActivity(saved, student, ActivityType.TICKET_CREATED, "Ticket created");
        logAudit(student, "CREATE", "Ticket", saved.getId(), null, "NEW");
        
        return toTicketResponse(saved);
    }

    @Override
    @Transactional
    public TicketResponse transitionStatus(Long ticketId, TicketStatus targetStatus, String reason, Long actorId) {
        Ticket ticket = getTicketEntity(ticketId);
        User actor = userRepository.findById(actorId).orElseThrow();
        
        validateTransition(ticket.getStatus(), targetStatus);
        
        // Time tracking
        if (ticket.getStatus() == TicketStatus.PENDING_STUDENT) {
            // we are leaving pending
            ticket.setPendingReason(null);
            ticket.setPendingSince(null);
        } else if (targetStatus == TicketStatus.PENDING_STUDENT) {
            // entering pending
            ticket.setPendingReason(reason);
            ticket.setPendingSince(LocalDateTime.now());
            // Add time spent in current non-pending state
            long elapsed = Duration.between(ticket.getLastStatusChangeAt(), LocalDateTime.now()).toMinutes();
            ticket.setActiveMinutesElapsed(ticket.getActiveMinutesElapsed() + elapsed);
        }
        
        if (targetStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
            long elapsed = Duration.between(ticket.getLastStatusChangeAt(), LocalDateTime.now()).toMinutes();
            ticket.setActiveMinutesElapsed(ticket.getActiveMinutesElapsed() + elapsed);
        } else if (targetStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        String oldStatus = ticket.getStatus().name();
        ticket.setStatus(targetStatus);
        ticket.setLastStatusChangeAt(LocalDateTime.now());
        
        ticketRepository.save(ticket);
        
        logActivity(ticket, actor, ActivityType.STATUS_CHANGED, "Status changed to " + targetStatus);
        logAudit(actor, "UPDATE_STATUS", "Ticket", ticket.getId(), oldStatus, targetStatus.name());
        
        return toTicketResponse(ticket);
    }

    private void validateTransition(TicketStatus current, TicketStatus target) {
        boolean valid = false;
        switch (current) {
            case NEW: valid = target == TicketStatus.ASSIGNED; break;
            case ASSIGNED: valid = target == TicketStatus.IN_PROGRESS; break;
            case IN_PROGRESS: valid = List.of(TicketStatus.PENDING_STUDENT, TicketStatus.ESCALATED, TicketStatus.RESOLVED).contains(target); break;
            case PENDING_STUDENT: valid = target == TicketStatus.IN_PROGRESS; break;
            case ESCALATED: valid = target == TicketStatus.IN_PROGRESS; break;
            case RESOLVED: valid = List.of(TicketStatus.CLOSED, TicketStatus.IN_PROGRESS).contains(target); break;
            case CLOSED: valid = false; break;
        }
        if (!valid) throw new InvalidTransitionException("Cannot transition from " + current + " to " + target);
    }

    @Override
    @Transactional
    public TicketResponse assignTicket(Long ticketId, Long staffId, Long actorId) {
        Ticket ticket = getTicketEntity(ticketId);
        User actor = userRepository.findById(actorId).orElseThrow();
        User staff = userRepository.findById(staffId).orElseThrow();
        
        ticket.setAssignedStaff(staff);
        if (ticket.getStatus() == TicketStatus.NEW) {
            ticket.setStatus(TicketStatus.ASSIGNED);
            ticket.setLastStatusChangeAt(LocalDateTime.now());
        }
        
        ticketRepository.save(ticket);
        logActivity(ticket, actor, ActivityType.ASSIGNED, "Assigned to " + staff.getName());
        logAudit(actor, "ASSIGN", "Ticket", ticket.getId(), null, staff.getId().toString());
        
        return toTicketResponse(ticket);
    }

    @Override
    @Transactional
    public CommentResponse addComment(Long ticketId, CommentCreateRequest request, Long actorId, Role role) {
        Ticket ticket = getTicketEntity(ticketId);
        User actor = userRepository.findById(actorId).orElseThrow();
        
        if (role == Role.STUDENT && request.getType() == CommentType.INTERNAL) {
            throw new UnauthorizedException("Students cannot add internal comments");
        }
        
        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthor(actor);
        comment.setContent(request.getContent());
        comment.setType(request.getType());
        
        TicketComment saved = commentRepository.save(comment);
        
        if (role == Role.STUDENT && ticket.getStatus() == TicketStatus.PENDING_STUDENT) {
            transitionStatus(ticketId, TicketStatus.IN_PROGRESS, "Student responded", actorId);
        }
        
        ActivityType at = request.getType() == CommentType.PUBLIC ? ActivityType.COMMENT_ADDED : ActivityType.INTERNAL_NOTE_ADDED;
        logActivity(ticket, actor, at, "Comment added");
        
        return commentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TicketResponse resolveTicket(Long ticketId, ResolveRequest request, Long actorId) {
        if (request.getResolutionNote() == null || request.getResolutionNote().isBlank()) {
            throw new IllegalArgumentException("Resolution note is required");
        }
        
        Ticket ticket = getTicketEntity(ticketId);
        ticket.setResolutionNote(request.getResolutionNote());
        ticketRepository.save(ticket);
        
        return transitionStatus(ticketId, TicketStatus.RESOLVED, "Resolved", actorId);
    }

    @Override
    @Transactional
    public TicketResponse escalateTicket(Long ticketId, EscalateRequest request, Long actorId) {
        Ticket ticket = getTicketEntity(ticketId);
        if (ticket.getStatus() == TicketStatus.ESCALATED) {
            throw new InvalidTransitionException("Ticket is already escalated");
        }
        
        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;
        
        Escalation escalation = new Escalation();
        escalation.setTicket(ticket);
        escalation.setEscalatedBy(actor);
        escalation.setReason(request.getReason());
        escalation.setAutomatic(actorId == null);
        escalation.setEscalatedAt(LocalDateTime.now());
        escalationRepository.save(escalation);
        
        return transitionStatus(ticketId, TicketStatus.ESCALATED, request.getReason(), actorId);
    }

    @Override
    public SlaStatus calculateSlaStatus(Ticket ticket) {
        if (ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED) {
            return ticket.getResolvedAt().isAfter(ticket.getSlaDeadline()) ? SlaStatus.BREACHED : SlaStatus.ON_TRACK;
        }
        if (LocalDateTime.now().isAfter(ticket.getSlaDeadline())) {
            return SlaStatus.BREACHED;
        }
        
        long totalAllocatedMins = Duration.between(ticket.getCreatedAt(), ticket.getSlaDeadline()).toMinutes();
        long activeMins = ticket.getActiveMinutesElapsed();
        if (ticket.getStatus() != TicketStatus.PENDING_STUDENT) {
            activeMins += Duration.between(ticket.getLastStatusChangeAt(), LocalDateTime.now()).toMinutes();
        }
        
        long remaining = totalAllocatedMins - activeMins;
        if (remaining <= (totalAllocatedMins * 0.25)) {
            return SlaStatus.AT_RISK;
        }
        return SlaStatus.ON_TRACK;
    }

    @Override
    @Transactional
    public void runEscalationCheck() {
        List<Ticket> breached = ticketRepository.findBreachedTickets(LocalDateTime.now());
        for (Ticket ticket : breached) {
            if (ticket.getStatus() != TicketStatus.ESCALATED && !escalationRepository.existsByTicketId(ticket.getId())) {
                EscalateRequest req = new EscalateRequest();
                req.setReason("Automatic SLA Breach Escalation");
                escalateTicket(ticket.getId(), req, null);
            }
        }
    }

    @Override
    public List<CommentResponse> getComments(Long ticketId, Long actorId, Role role) {
        if (role == Role.STUDENT) {
            return commentRepository.findByTicketIdAndTypeOrderByCreatedAtAsc(ticketId, CommentType.PUBLIC)
                    .stream().map(commentMapper::toResponse).collect(Collectors.toList());
        }
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public TicketResponse getTicket(Long ticketId, Long actorId, Role role) {
        Ticket ticket = getTicketEntity(ticketId);
        if (role == Role.STUDENT && !ticket.getStudent().getId().equals(actorId)) {
            throw new UnauthorizedException("Cannot access this ticket");
        }
        return toTicketResponse(ticket);
    }

    @Override
    public PagedResponse<TicketSummaryResponse> getTickets(TicketFilterRequest filter, Pageable pageable, Long actorId, Role role) {
        Long studentId = (role == Role.STUDENT) ? actorId : null;
        Specification<Ticket> spec = TicketSpecification.getSpecification(filter, studentId);
        Page<Ticket> page = ticketRepository.findAll(spec, pageable);
        
        List<TicketSummaryResponse> content = page.getContent().stream().map(t -> {
            TicketSummaryResponse res = ticketMapper.toSummaryResponse(t);
            res.setSlaStatus(calculateSlaStatus(t));
            return res;
        }).collect(Collectors.toList());

        // In memory filtering for SLA Status if requested
        if (filter != null && filter.getSlaStatus() != null) {
            content = content.stream()
                    .filter(t -> t.getSlaStatus() == filter.getSlaStatus())
                    .collect(Collectors.toList());
        }

        return new PagedResponse<>(content, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    private Ticket getTicketEntity(Long id) {
        return ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));
    }

    private void logActivity(Ticket ticket, User actor, ActivityType type, String desc) {
        TicketActivity activity = new TicketActivity();
        activity.setTicket(ticket);
        activity.setActor(actor);
        activity.setActivityType(type);
        activity.setDescription(desc);
        activityRepository.save(activity);
    }
    
    private void logAudit(User actor, String action, String type, Long id, String oldVal, String newVal) {
        if (actor == null) return;
        AuditLog audit = new AuditLog();
        audit.setActor(actor);
        audit.setAction(action);
        audit.setEntityType(type);
        audit.setEntityId(id);
        audit.setOldValue(oldVal);
        audit.setNewValue(newVal);
        auditLogRepository.save(audit);
    }
    
    private TicketResponse toTicketResponse(Ticket ticket) {
        TicketResponse res = ticketMapper.toResponse(ticket);
        res.setSlaStatus(calculateSlaStatus(ticket));
        return res;
    }
}
