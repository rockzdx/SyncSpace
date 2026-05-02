package com.syncspace.controller;

import com.syncspace.dto.*;
import com.syncspace.service.SyncSpaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TeamController {

    private final SyncSpaceService service;

    public TeamController(SyncSpaceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getUserTeams(@RequestParam Long userId) {
        return ResponseEntity.ok(service.getUserTeams(userId));
    }

    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestParam String name, @RequestParam String description, @RequestParam Long creatorId) {
        return ResponseEntity.ok(service.createTeam(name, description, creatorId));
    }

    @PostMapping("/{teamId}/join")
    public ResponseEntity<TeamDTO> joinTeam(@PathVariable Long teamId, @RequestParam Long userId) {
        return ResponseEntity.ok(service.joinTeam(teamId, userId));
    }

    // --- TASKS ---
    @GetMapping("/{teamId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasks(@PathVariable Long teamId, @RequestParam(required = false) Long assigneeId) {
        return ResponseEntity.ok(service.getTasks(teamId, assigneeId));
    }

    @PostMapping("/{teamId}/tasks")
    public ResponseEntity<TaskDTO> createTask(@PathVariable Long teamId, @RequestParam Long creatorId, 
                                              @RequestParam String title, @RequestParam String description, 
                                              @RequestParam String priority,
                                              @RequestParam(required = false) Integer storyPoints,
                                              @RequestParam(required = false) java.time.LocalDate dueDate,
                                              @RequestParam(required = false) Long blockedById) {
        return ResponseEntity.ok(service.createTask(teamId, creatorId, title, description, com.syncspace.model.Task.Priority.valueOf(priority), storyPoints, dueDate, blockedById));
    }

    // --- CHAT & ACTIVITY ---
    @GetMapping("/{teamId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Long teamId) {
        return ResponseEntity.ok(service.getMessages(teamId));
    }

    @PostMapping("/{teamId}/messages")
    public ResponseEntity<MessageDTO> sendMessage(@PathVariable Long teamId, @RequestParam Long senderId, @RequestParam String content) {
        return ResponseEntity.ok(service.sendMessage(teamId, senderId, content));
    }

    @GetMapping("/{teamId}/activity")
    public ResponseEntity<List<ActivityLogDTO>> getActivityLogs(@PathVariable Long teamId) {
        return ResponseEntity.ok(service.getActivityLogs(teamId));
    }
}
