package com.site.backend.dto;

public class CategoryDTO {
    private int id;
    private String name;
    private Integer parentId;

    public CategoryDTO(int id, String name, Integer parentId){
        this.id = id;
        this.name = name;
        this.parentId = parentId;
    }

    public int getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public Integer getParentId(){
        return parentId;
    }
}
