package com.syncspace.repository;

import com.syncspace.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTeamIdOrderByCreatedAtDesc(Long teamId);
    List<Task> findByTeamIdAndAssigneeIdOrderByCreatedAtDesc(Long teamId, Long assigneeId);
}
