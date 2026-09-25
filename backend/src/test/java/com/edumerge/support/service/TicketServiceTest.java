package com.edumerge.support.service;

import com.edumerge.support.dto.request.TicketCreateRequest;
import com.edumerge.support.dto.response.TicketResponse;
import com.edumerge.support.entity.*;
import com.edumerge.support.enums.*;
import com.edumerge.support.exception.InvalidTransitionException;
import com.edumerge.support.mapper.CommentMapper;
import com.edumerge.support.mapper.TicketMapper;
import com.edumerge.support.repository.*;
import com.edumerge.support.service.impl.TicketServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock private TicketRepository ticketRepository;
    @Mock private UserRepository userRepository;
    @Mock private TicketCategoryRepository categoryRepository;
    @Mock private SlaPolicyRepository slaPolicyRepository;
    @Mock private TicketActivityRepository activityRepository;
    @Mock private AuditLogRepository auditLogRepository;
    @Mock private TicketMapper ticketMapper;
    @Mock private EscalationRepository escalationRepository;
    @Mock private TicketCommentRepository commentRepository;
    @Mock private CommentMapper commentMapper;

    @InjectMocks
    private TicketServiceImpl ticketService;

    private User student;
    private TicketCategory category;
    private Ticket ticket;
    private SlaPolicy slaPolicy;

    @BeforeEach
    void setUp() {
        student = new User();
        student.setId(1L);
        student.setName("Student");

        category = new TicketCategory();
        category.setId(1L);

        slaPolicy = new SlaPolicy();
        slaPolicy.setResolutionHours(24);

        ticket = new Ticket();
        ticket.setId(1L);
        ticket.setStatus(TicketStatus.NEW);
        ticket.setStudent(student);
        ticket.setCategory(category);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setSlaDeadline(LocalDateTime.now().plusHours(24));
        ticket.setLastStatusChangeAt(LocalDateTime.now());
    }

    @Test
    void createTicket_Success() {
        TicketCreateRequest req = new TicketCreateRequest();
        req.setCategoryId(1L);
        req.setRequestedPriority(Priority.MEDIUM);
        req.setTitle("Title");
        req.setDescription("Desc");

        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(slaPolicyRepository.findByPriority(Priority.MEDIUM)).thenReturn(Optional.of(slaPolicy));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> {
            Ticket t = i.getArgument(0);
            t.setId(1L);
            // Simulate auditing that @CreatedDate would set in production
            if (t.getCreatedAt() == null) t.setCreatedAt(LocalDateTime.now());
            if (t.getLastStatusChangeAt() == null) t.setLastStatusChangeAt(LocalDateTime.now());
            if (t.getSlaDeadline() == null) t.setSlaDeadline(LocalDateTime.now().plusHours(24));
            return t;
        });
        
        TicketResponse mockResponse = new TicketResponse();
        mockResponse.setStatus(TicketStatus.NEW);
        when(ticketMapper.toResponse(any(Ticket.class))).thenReturn(mockResponse);

        TicketResponse res = ticketService.createTicket(req, 1L);
        
        assertNotNull(res);
        assertEquals(TicketStatus.NEW, res.getStatus());
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    void transitionStatus_NewToAssigned_Success() {
        User staff = new User();
        staff.setId(2L);
        
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(ticketMapper.toResponse(any())).thenReturn(new TicketResponse());
        
        ticketService.transitionStatus(1L, TicketStatus.ASSIGNED, null, 2L);
        
        assertEquals(TicketStatus.ASSIGNED, ticket.getStatus());
        verify(ticketRepository).save(ticket);
    }

    @Test
    void transitionStatus_NewToResolved_ThrowsException() {
        User staff = new User();
        staff.setId(2L);
        
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        
        assertThrows(InvalidTransitionException.class, () -> 
            ticketService.transitionStatus(1L, TicketStatus.RESOLVED, null, 2L)
        );
    }
}
