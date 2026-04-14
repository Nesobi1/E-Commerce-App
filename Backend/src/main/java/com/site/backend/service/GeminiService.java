package com.site.backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${gemini.api.key}")
    private String API_KEY;
    private final String URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public String sendMessage(String message) {
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", message))
                ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-goog-api-key", API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(URL, request, Map.class);

        List candidates = (List) response.getBody().get("candidates");
        Map content = (Map) ((Map) candidates.get(0)).get("content");
        List parts = (List) content.get("parts");
        return (String) ((Map) parts.get(0)).get("text");
    }
}
