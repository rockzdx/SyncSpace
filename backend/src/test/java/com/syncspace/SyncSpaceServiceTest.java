package com.syncspace;

import com.syncspace.dto.TaskDTO;
import com.syncspace.dto.TeamDTO;
import com.syncspace.model.Task;
import com.syncspace.model.Team;
import com.syncspace.model.User;
import com.syncspace.repository.ActivityLogRepository;
import com.syncspace.repository.TaskRepository;
import com.syncspace.repository.TeamRepository;
import com.syncspace.repository.UserRepository;
import com.syncspace.service.SyncSpaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class SyncSpaceServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private TeamRepository teamRepository;
    @Mock private TaskRepository taskRepository;
    @Mock private ActivityLogRepository activityLogRepository;

    @InjectMocks
    private SyncSpaceService syncSpaceService;

    @BeforeEach
    void setUp() {
        // Initialize Mockito annotations
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTeam_Success() {
        // Arrange
        User mockUser = new User("admin", "pass", "admin@test.com");
        mockUser.setId(1L);

        Team mockTeam = new Team("Alpha Team", "Hackathon Group");
        mockTeam.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(teamRepository.save(any(Team.class))).thenReturn(mockTeam);

        // Act
        TeamDTO result = syncSpaceService.createTeam("Alpha Team", "Hackathon Group", 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Alpha Team", result.name());
        verify(activityLogRepository, times(1)).save(any());
    }

    @Test
    void testUpdateTaskStatus_Success() {
        // Arrange
        User mockUser = new User("dev", "pass", "dev@test.com");
        mockUser.setId(2L);

        Team mockTeam = new Team("Beta Team", "Desc");
        mockTeam.setId(2L);

        Task mockTask = new Task();
        mockTask.setId(10L);
        mockTask.setTitle("Implement JUnit");
        mockTask.setStatus(Task.Status.TODO);
        mockTask.setTeam(mockTeam);

        when(taskRepository.findById(10L)).thenReturn(Optional.of(mockTask));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser));
        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        // Act
        TaskDTO result = syncSpaceService.updateTaskStatus(10L, 2L, Task.Status.DONE);

        // Assert
        assertEquals(Task.Status.DONE, result.status());
        assertEquals("Implement JUnit", result.title());
        
        // Verify that the automated ActivityLog trigger fired!
        verify(activityLogRepository, times(1)).save(any());
    }
}
