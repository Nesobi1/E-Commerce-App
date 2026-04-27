package com.site.backend.dto;

public class UserDTO {
    private int id;
    private String email;
    private String username;
    private boolean gender;
    private String roleType;
    private boolean suspended;

    public UserDTO() {}

    public UserDTO(int id, String email, String username, boolean gender,
                   String roleType, boolean suspended) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.gender = gender;
        this.roleType = roleType;
        this.suspended = suspended;
    }

    public int getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public boolean isGender() { return gender; }
    public String getRoleType() { return roleType; }
    public boolean isSuspended() { return suspended; }

    public void setId(int id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
    public void setGender(boolean gender) { this.gender = gender; }
    public void setRoleType(String roleType) { this.roleType = roleType; }
    public void setSuspended(boolean suspended) { this.suspended = suspended; }
}
