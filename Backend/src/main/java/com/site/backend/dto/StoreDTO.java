package com.site.backend.dto;

public class StoreDTO {
    private int id;
    private String name;
    private String status;

    public StoreDTO(int id, String name, String status){
        this.id = id;
        this.name = name;
        this.status = status;
    }

    public String getName(){
        return name;
    }

    public String getStatus(){
        return status;
    }

    public int getId(){
        return id;
    }
}
