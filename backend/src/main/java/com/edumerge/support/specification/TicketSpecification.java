package com.edumerge.support.specification;

import com.edumerge.support.dto.request.TicketFilterRequest;
import com.edumerge.support.entity.Ticket;
import com.edumerge.support.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TicketSpecification {

    public static Specification<Ticket> getSpecification(TicketFilterRequest filter, Long studentId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (studentId != null) {
                predicates.add(criteriaBuilder.equal(root.get("student").get("id"), studentId));
            }

            if (filter != null) {
                if (filter.getStatus() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
                }
                if (filter.getPriority() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("priority"), filter.getPriority()));
                }
                if (filter.getCategoryId() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId()));
                }
                if (filter.getAssigneeId() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("assignedStaff").get("id"), filter.getAssigneeId()));
                }
                if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                    String pattern = "%" + filter.getSearch().toLowerCase() + "%";
                    Join<Ticket, User> studentJoin = root.join("student");
                    predicates.add(criteriaBuilder.or(
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("ticketNumber")), pattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
                            criteriaBuilder.like(criteriaBuilder.lower(studentJoin.get("name")), pattern)
                    ));
                }
                // Note: slaStatus filtering would typically be done post-DB or with more complex logic, 
                // but since it depends on run-time elapsed minutes, we might filter it in memory for small datasets
                // or have an exact deadline logic for DB. We'll skip complex DB SLA status filtering for now.
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
