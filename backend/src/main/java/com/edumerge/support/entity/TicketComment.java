package com.edumerge.support.entity;

import com.edumerge.support.enums.CommentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="ticket_comments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class TicketComment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Ticket ticket;
    @ManyToOne
    private User author;
    @Column(columnDefinition="TEXT")
    private String content;
    @Enumerated(EnumType.STRING)
    private CommentType type;
    @CreatedDate
    private LocalDateTime createdAt;
}
