package com.site.backend.dto;

public class UserDTO {
    private int id;
    private boolean gender;

    public UserDTO(int id, boolean gender){
        this.id = id;
        this.gender = gender;
    }

    public int getId(){
        return id;
    }

    public boolean getGender(){
        return gender;
    }

}
