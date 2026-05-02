package com.syncspace.service;

import com.syncspace.dto.*;
import com.syncspace.model.*;
import com.syncspace.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SyncSpaceService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final MessageRepository messageRepository;
    private final ActivityLogRepository activityLogRepository;

    public SyncSpaceService(UserRepository userRepository, TeamRepository teamRepository, 
                            TaskRepository taskRepository, MessageRepository messageRepository, 
                            ActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.taskRepository = taskRepository;
        this.messageRepository = messageRepository;
        this.activityLogRepository = activityLogRepository;
    }

    // --- TEAMS ---
    public List<TeamDTO> getUserTeams(Long userId) {
        return teamRepository.findByMembersId(userId).stream()
                .map(DTOMapper::toTeamDTO).collect(Collectors.toList());
    }

    @Transactional
    public TeamDTO createTeam(String name, String description, Long creatorId) {
        User creator = userRepository.findById(creatorId).orElseThrow();
        Team team = new Team(name, description);
        team.getMembers().add(creator);
        team = teamRepository.save(team);
        logActivity("Created team '" + name + "'", creator, team, null);
        return DTOMapper.toTeamDTO(team);
    }

    @Transactional
    public TeamDTO joinTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        team.getMembers().add(user);
        team = teamRepository.save(team);
        logActivity("Joined the team", user, team, null);
        return DTOMapper.toTeamDTO(team);
    }

    // --- TASKS ---
    public List<TaskDTO> getTasks(Long teamId, Long assigneeId) {
        if (assigneeId != null) {
            return taskRepository.findByTeamIdAndAssigneeIdOrderByCreatedAtDesc(teamId, assigneeId).stream()
                    .map(DTOMapper::toTaskDTO).collect(Collectors.toList());
        }
        return taskRepository.findByTeamIdOrderByCreatedAtDesc(teamId).stream()
                .map(DTOMapper::toTaskDTO).collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(Long teamId, Long creatorId, String title, String description, Task.Priority priority, Integer storyPoints, java.time.LocalDate dueDate, Long blockedById) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User creator = userRepository.findById(creatorId).orElseThrow();
        
        Task task = new Task();
        task.setTeam(team);
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(priority);
        task.setStoryPoints(storyPoints);
        task.setDueDate(dueDate);
        if (blockedById != null) {
            task.setBlockedBy(taskRepository.findById(blockedById).orElse(null));
        }
        task = taskRepository.save(task);
        
        logActivity("Created task '" + title + "'", creator, team, task);
        return DTOMapper.toTaskDTO(task);
    }

    @Transactional
    public TaskDTO updateTaskStatus(Long taskId, Long userId, Task.Status newStatus) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        Task.Status oldStatus = task.getStatus();
        if (oldStatus != newStatus) {
            task.setStatus(newStatus);
            task = taskRepository.save(task);
            logActivity("Moved task '" + task.getTitle() + "' from " + oldStatus + " to " + newStatus, user, task.getTeam(), task);
        }
        return DTOMapper.toTaskDTO(task);
    }

    // --- CHAT & ACTIVITY ---
    @Transactional
    public MessageDTO sendMessage(Long teamId, Long senderId, String content) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User sender = userRepository.findById(senderId).orElseThrow();
        
        Message message = new Message();
        message.setTeam(team);
        message.setSender(sender);
        message.setContent(content);
        return DTOMapper.toMessageDTO(messageRepository.save(message));
    }

    public List<MessageDTO> getMessages(Long teamId) {
        return messageRepository.findByTeamIdOrderByCreatedAtAsc(teamId).stream()
                .map(DTOMapper::toMessageDTO).collect(Collectors.toList());
    }

    public List<ActivityLogDTO> getActivityLogs(Long teamId) {
        return activityLogRepository.findByTeamIdOrderByCreatedAtDesc(teamId).stream()
                .map(DTOMapper::toActivityLogDTO).collect(Collectors.toList());
    }

    private void logActivity(String action, User user, Team team, Task task) {
        ActivityLog log = new ActivityLog(action, user, team, task);
        activityLogRepository.save(log);
    }
}

/**
 * GOOGLE CLOUD VERTEX AI & GEMINI INTEGRATION (PROVISIONED)
 * 
 * // import com.google.cloud.vertexai.VertexAI;
 * // import com.google.cloud.vertexai.generativeai.GenerativeModel;
 * // import com.google.cloud.storage.Storage;
 * // import com.google.cloud.storage.BlobInfo;
 * // import com.google.cloud.pubsub.v1.Publisher;
 * 
 * /*
 * public void analyzeTaskWithGoogleGemini(Task task) {
 *     // VertexAI vertexAI = new VertexAI("promptwars-syncspace", "us-central1");
 *     // GenerativeModel model = new GenerativeModel("gemini-pro", vertexAI);
 *     // String response = model.generateContent("Analyze this task: " + task.getTitle());
 *     // task.setAiSummary(response);
 *     // Storage storage = StorageOptions.getDefaultInstance().getService();
 *     // storage.create(BlobInfo.newBuilder("syncspace-ai-logs", task.getId()).build(), response.getBytes());
 * }
 * */
 */
