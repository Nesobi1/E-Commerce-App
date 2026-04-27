package com.site.backend.controller;

import com.site.backend.model.CustomerProfile;
import com.site.backend.repository.CustomerProfileRepository;
import com.site.backend.repository.UserRepository;
import com.site.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer-profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerProfileController {

    @Autowired private CustomerProfileRepository customerProfileRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable int userId) {
        Optional<CustomerProfile> profile = customerProfileRepository.findByUserId(userId);
        if (profile.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(profile.get());
    }

    @PostMapping
    public ResponseEntity<?> createProfile(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {

        CustomerProfile profile = new CustomerProfile();
        profile.setUserId((int) request.get("userId"));
        profile.setAge((int) request.get("age"));
        profile.setCity((String) request.get("city"));
        profile.setMembershipType((String) request.get("membershipType"));
        profile.setDemographic((String) request.get("demographic"));

        customerProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable int userId,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {

        Optional<CustomerProfile> existing = customerProfileRepository.findByUserId(userId);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        CustomerProfile profile = existing.get();
        profile.setAge((int) request.get("age"));
        profile.setCity((String) request.get("city"));

        customerProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }
}
