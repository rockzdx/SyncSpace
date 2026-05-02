package com.syncspace.dto;

import com.syncspace.model.*;
import java.util.stream.Collectors;

public class DTOMapper {
    
    public static UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
    }

    public static TeamDTO toTeamDTO(Team team) {
        if (team == null) return null;
        return new TeamDTO(
            team.getId(), 
            team.getName(), 
            team.getDescription(), 
            team.getCreatedAt(),
            team.getMembers().stream().map(DTOMapper::toUserDTO).collect(Collectors.toList())
        );
    }

    public static TaskDTO toTaskDTO(Task task) {
        if (task == null) return null;
        return new TaskDTO(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            toUserDTO(task.getAssignee()),
            task.getTeam().getId(),
            task.getCreatedAt(),
            task.getUpdatedAt(),
            task.getStoryPoints(),
            task.getDueDate(),
            task.getBlockedBy() != null ? task.getBlockedBy().getId() : null
        );
    }

    public static MessageDTO toMessageDTO(Message message) {
        if (message == null) return null;
        return new MessageDTO(
            message.getId(),
            message.getContent(),
            toUserDTO(message.getSender()),
            message.getTeam().getId(),
            message.getCreatedAt()
        );
    }

    public static ActivityLogDTO toActivityLogDTO(ActivityLog log) {
        if (log == null) return null;
        return new ActivityLogDTO(
            log.getId(),
            log.getAction(),
            toUserDTO(log.getUser()),
            log.getTeam().getId(),
            log.getTask() != null ? log.getTask().getId() : null,
            log.getCreatedAt()
        );
    }
}
