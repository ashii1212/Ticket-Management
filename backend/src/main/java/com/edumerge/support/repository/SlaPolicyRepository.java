package com.edumerge.support.repository;

import com.edumerge.support.entity.SlaPolicy;
import com.edumerge.support.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SlaPolicyRepository extends JpaRepository<SlaPolicy, Long> {
    Optional<SlaPolicy> findByPriority(Priority priority);
}
