package com.edumerge.support.entity;

import com.edumerge.support.enums.Priority;
import com.edumerge.support.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="tickets")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String ticketNumber;
    @ManyToOne
    private User student;
    @ManyToOne
    private TicketCategory category;
    private String title;
    @Column(columnDefinition="TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    @ManyToOne
    private User assignedStaff;
    
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime slaDeadline;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    
    @Column(columnDefinition="TEXT")
    private String resolutionNote;
    
    private String pendingReason;
    private LocalDateTime pendingSince;
    private long activeMinutesElapsed;
    private LocalDateTime lastStatusChangeAt;
}
