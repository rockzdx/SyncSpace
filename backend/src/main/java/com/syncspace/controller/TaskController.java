package com.syncspace.controller;

import com.syncspace.dto.TaskDTO;
import com.syncspace.service.SyncSpaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskController {

    private final SyncSpaceService service;

    public TaskController(SyncSpaceService service) {
        this.service = service;
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long taskId, @RequestParam Long userId, @RequestParam String status) {
        return ResponseEntity.ok(service.updateTaskStatus(taskId, userId, com.syncspace.model.Task.Status.valueOf(status)));
    }
}
