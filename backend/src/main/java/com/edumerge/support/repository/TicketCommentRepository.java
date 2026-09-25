package com.edumerge.support.repository;

import com.edumerge.support.entity.TicketComment;
import com.edumerge.support.enums.CommentType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {
    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
    List<TicketComment> findByTicketIdAndTypeOrderByCreatedAtAsc(Long ticketId, CommentType type);
}
