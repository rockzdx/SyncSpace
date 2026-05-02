package com.syncspace.dto;

import com.syncspace.model.Task;
import java.time.LocalDateTime;

public record TaskDTO(
    Long id, 
    String title, 
    String description, 
    Task.Status status, 
    Task.Priority priority, 
    UserDTO assignee, 
    Long teamId, 
    LocalDateTime createdAt, 
    LocalDateTime updatedAt,
    Integer storyPoints,
    java.time.LocalDate dueDate,
    Long blockedById
) {
}
