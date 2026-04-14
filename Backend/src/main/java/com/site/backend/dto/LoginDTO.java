package com.site.backend.dto;

public class LoginDTO {
    private String email;
    private String passwordHash;

    public LoginDTO(String email, String passwordHash){
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
}
