package com.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "`User`")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    @Column(name = "password_hash")
    private String passwordHash;
    @Column(name = "role_type")
    private String roleType;
    private boolean gender;
    private String username;
    private boolean suspended;

    public User() {}

    public int getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRoleType() { return roleType; }
    public boolean getGender() { return gender; }
    public String getUsername() { return username; }
    public boolean isSuspended() { return suspended; }

    public void setId(int id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setRoleType(String roleType) { this.roleType = roleType; }
    public void setGender(boolean gender) { this.gender = gender; }
    public void setUsername(String username) { this.username = username; }
    public void setSuspended(boolean suspended) { this.suspended = suspended; }
}
