package com.site.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_URL = "http://localhost:8000/chat";

    @PostMapping
    public ResponseEntity<Map> chat(@RequestBody Map<String, Object> body) {
        Map<String, Object> request = new HashMap<>();
        request.put("message",   body.get("message"));
        request.put("user_role", body.getOrDefault("user_role", "ADMIN"));
        request.put("user_id",   body.getOrDefault("user_id", null));
        request.put("history",   body.getOrDefault("history", List.of()));

        ResponseEntity<Map> response = restTemplate.postForEntity(
                PYTHON_URL, request, Map.class
        );
        return ResponseEntity.ok(response.getBody());
    }
}
