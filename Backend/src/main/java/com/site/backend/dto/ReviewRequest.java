package com.site.backend.dto;

public class ReviewRequest {
    private int starRating;
    private String title;
    private String text;

    public ReviewRequest() {}

    public int getStarRating() { return starRating; }
    public String getTitle() { return title; }
    public String getText() { return text; }

    public void setStarRating(int starRating) { this.starRating = starRating; }
    public void setTitle(String title) { this.title = title; }
    public void setText(String text) { this.text = text; }
}
