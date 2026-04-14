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

    public User(){

    }

    public int getId(){
        return id;
    }
    public String getEmail(){
        return email;
    }
    public String getPasswordHash(){
        return passwordHash;
    }
    public String getRoleType(){
        return roleType;
    }
    public boolean getGender(){
        return gender;
    }

    public void setId(int id){
        this.id = id;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setPasswordHash(String passwordHash){
        this.passwordHash = passwordHash;
    }
    public void setRoleType(String roleType){
        this.roleType = roleType;
    }
    public void setGender(boolean gender){
        this.gender = gender;
    }
}
