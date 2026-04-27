package com.site.backend.controller;

import com.site.backend.dto.ReviewDTO;
import com.site.backend.dto.ReviewRequest;
import com.site.backend.model.Store;
import com.site.backend.model.User;
import com.site.backend.repository.StoreRepository;
import com.site.backend.repository.UserRepository;
import com.site.backend.security.JwtUtil;
import com.site.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

    @Autowired private ReviewService reviewService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private StoreRepository storeRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getByProduct(@PathVariable int productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<?> submit(
            @PathVariable int productId,
            @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User user = userRepository.findByEmail(email);
        if (user.getRoleType().equals("CORPORATE") || user.getRoleType().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Only customers can submit reviews");
        }

        return ResponseEntity.ok(reviewService.submit(productId, email, request));
    }

    @GetMapping("/manage")
    public ResponseEntity<?> getReviewsForManagement(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);

        if (user.getRoleType().equals("CUSTOMER")) {
            return ResponseEntity.status(403).body("Access denied");
        }

        if (user.getRoleType().equals("ADMIN")) {
            return ResponseEntity.ok(reviewService.getAllReviews());
        }

        Optional<Store> store = storeRepository.findByOwnerId(user.getId());
        if (store.isEmpty()) return ResponseEntity.ok(List.of());

        return ResponseEntity.ok(reviewService.getByStore(store.get().getId()));
    }

    @PutMapping("/{reviewId}/response")
    public ResponseEntity<?> respondToReview(
            @PathVariable int reviewId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);

        if (user.getRoleType().equals("CUSTOMER")) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(reviewService.submitResponse(reviewId, request.get("response")));
    }
}
