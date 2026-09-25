package com.edumerge.support.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="audit_logs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User actor;
    private String action;
    private String entityType;
    private Long entityId;
    @Column(columnDefinition="TEXT")
    private String oldValue;
    @Column(columnDefinition="TEXT")
    private String newValue;
    private String ipAddress;
    @CreatedDate
    private LocalDateTime createdAt;
}
