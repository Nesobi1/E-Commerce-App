package com.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Stores")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int id;
    @Column(name = "owner_id")
    private int ownerId;
    private String name;
    private String status;

    public Store(){

    }

    public int getId(){
        return id;
    }
    public int getOwnerId(){
        return ownerId;
    }
    public String getName(){
        return name;
    }
    public String getStatus(){
        return status;
    }

    public void setId(int id){
        this.id = id;
    }
    public void setOwnerId(int ownerId){
        this.ownerId = ownerId;
    }
    public void setName(String name){
        this.name = name;
    }
    public void setStatus(String status){
        this.status = status;
    }
}
