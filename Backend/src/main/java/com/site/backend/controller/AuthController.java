package com.site.backend.controller;

import com.site.backend.model.User;
import com.site.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.site.backend.dto.LoginDTO;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import com.site.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null || !user.getPasswordHash().equals(request.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRoleType(),
                user.getUsername(),
                String.valueOf(user.getGender())
        );

        return ResponseEntity.ok(Map.of(
                "token",   token,
                "message", "Login successful"
        ));
    }
}