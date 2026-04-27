package com.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Customer_Profiles")
public class CustomerProfile {

    @Id
    @Column(name = "user_id")
    private int userId;

    private int age;
    private String city;

    @Column(name = "membership_type")
    private String membershipType;

    private String demographic;

    public CustomerProfile() {}

    public int getUserId() { return userId; }
    public int getAge() { return age; }
    public String getCity() { return city; }
    public String getMembershipType() { return membershipType; }
    public String getDemographic() { return demographic; }

    public void setUserId(int userId) { this.userId = userId; }
    public void setAge(int age) { this.age = age; }
    public void setCity(String city) { this.city = city; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }
    public void setDemographic(String demographic) { this.demographic = demographic; }
}
