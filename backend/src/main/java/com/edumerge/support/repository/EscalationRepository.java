package com.edumerge.support.repository;

import com.edumerge.support.entity.Escalation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EscalationRepository extends JpaRepository<Escalation, Long> {
    boolean existsByTicketId(Long ticketId);
}
