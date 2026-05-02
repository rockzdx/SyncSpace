package com.syncspace.repository;

import com.syncspace.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByTeamIdOrderByCreatedAtDesc(Long teamId);
}
