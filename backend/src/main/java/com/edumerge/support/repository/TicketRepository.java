package com.edumerge.support.repository;

import com.edumerge.support.entity.Ticket;
import com.edumerge.support.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDateTime;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    long countByStudentIdAndStatus(Long studentId, TicketStatus status);
    
    @Query("SELECT t FROM Ticket t WHERE t.student.id = :studentId ORDER BY t.updatedAt DESC LIMIT 5")
    List<Ticket> findTop5ByStudentIdOrderByUpdatedAtDesc(@Param("studentId") Long studentId);
    
    long countByAssignedStaffId(Long staffId);
    long countByAssignedStaffIsNull();
    long countByStatus(TicketStatus status);
    
    @Query("SELECT t FROM Ticket t WHERE t.status NOT IN ('RESOLVED', 'CLOSED') AND t.slaDeadline < :now")
    List<Ticket> findBreachedTickets(@Param("now") LocalDateTime now);
}
