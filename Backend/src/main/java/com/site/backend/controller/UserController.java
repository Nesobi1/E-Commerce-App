package com.site.backend.controller;

import com.site.backend.model.User;
import com.site.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.site.backend.security.JwtUtil;

import java.util.Map;
import java.util.stream.Collectors;
import com.site.backend.dto.UserDTO;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    private UserDTO toDTO(User u) {
        return new UserDTO(u.getId(), u.getEmail(), u.getUsername(),
                u.getGender(), u.getRoleType(), u.isSuspended());
    }

    private boolean isAdmin(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        return user != null && user.getRoleType().equals("ADMIN");
    }

    @GetMapping
    public ResponseEntity<?> getAllUser(
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader))
            return ResponseEntity.status(403).body("Access denied");
        return ResponseEntity.ok(
                userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList())
        );
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(
            @PathVariable String role,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader))
            return ResponseEntity.status(403).body("Access denied");
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .filter(u -> u.getRoleType().equalsIgnoreCase(role))
                        .map(this::toDTO)
                        .collect(Collectors.toList())
        );
    }

    @PatchMapping("/{id}/suspend")
    public ResponseEntity<?> suspendUser(
            @PathVariable int id,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader))
            return ResponseEntity.status(403).body("Access denied");
        return userRepository.findById(id).map(user -> {
            user.setSuspended(!user.isSuspended());
            return ResponseEntity.ok(toDTO(userRepository.save(user)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable int id,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader))
            return ResponseEntity.status(403).body("Access denied");
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable int id,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);

        if (user == null || user.getId() != id)
            return ResponseEntity.status(403).body("Forbidden");

        user.setUsername((String) request.get("username"));
        user.setGender((Boolean) request.get("gender"));
        userRepository.save(user);

        String newToken = jwtUtil.generateToken(
                user.getEmail(), user.getId(), user.getRoleType(),
                user.getUsername(), String.valueOf(user.getGender())
        );
        return ResponseEntity.ok(Map.of("token", newToken));
    }
}
