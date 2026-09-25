package com.edumerge.support.entity;

import com.edumerge.support.enums.Priority;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="sla_policies")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class SlaPolicy {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    private int resolutionHours;
    private boolean active = true;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
