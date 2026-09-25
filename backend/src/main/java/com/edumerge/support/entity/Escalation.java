package com.edumerge.support.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="escalations")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Escalation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Ticket ticket;
    @ManyToOne
    private User escalatedBy;
    private String reason;
    private boolean automatic;
    @CreatedDate
    private LocalDateTime escalatedAt;
}
