package com.edumerge.support.entity;

import com.edumerge.support.enums.ActivityType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="ticket_activities")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class TicketActivity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Ticket ticket;
    @ManyToOne
    private User actor;
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;
    private String description;
    private String metadata;
    @CreatedDate
    private LocalDateTime createdAt;
}
