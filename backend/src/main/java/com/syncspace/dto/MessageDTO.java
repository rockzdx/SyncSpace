package com.syncspace.dto;

import java.time.LocalDateTime;

public record MessageDTO(Long id, String content, UserDTO sender, Long teamId, LocalDateTime createdAt) {
}
