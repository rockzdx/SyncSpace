package com.syncspace.controller;

import com.syncspace.dto.UserDTO;
import com.syncspace.model.User;
import com.syncspace.repository.UserRepository;
import com.syncspace.dto.DTOMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestParam String username, @RequestParam String password, @RequestParam String email) {
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().build();
        }
        User user = new User(username, password, email);
        return ResponseEntity.ok(DTOMapper.toUserDTO(userRepository.save(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestParam String username, @RequestParam String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password)) // In real app, use password encoder
                .map(DTOMapper::toUserDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
