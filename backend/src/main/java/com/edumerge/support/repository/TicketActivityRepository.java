package com.edumerge.support.repository;

import com.edumerge.support.entity.TicketActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketActivityRepository extends JpaRepository<TicketActivity, Long> {
    List<TicketActivity> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
}
