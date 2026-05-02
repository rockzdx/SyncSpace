package com.syncspace.dto;

import java.time.LocalDateTime;

public record ActivityLogDTO(Long id, String action, UserDTO user, Long teamId, Long taskId, LocalDateTime createdAt) {
}
