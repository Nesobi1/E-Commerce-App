package com.site.backend.controller;

import com.site.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        String response = geminiService.sendMessage(message);
        return ResponseEntity.ok(response);
    }
}
