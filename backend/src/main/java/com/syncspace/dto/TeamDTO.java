package com.syncspace.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TeamDTO(Long id, String name, String description, LocalDateTime createdAt, List<UserDTO> members) {
}
