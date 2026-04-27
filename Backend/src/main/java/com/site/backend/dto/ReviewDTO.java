package com.site.backend.dto;

public class ReviewDTO {
    private int id;
    private String userEmail;
    private int starRating;
    private String sentiment;
    private String title;
    private String text;
    private String response;
    private String productName;

    public ReviewDTO() {}

    public ReviewDTO(int id, String userEmail, int starRating, String sentiment,
                     String title, String text, String response, String productName) {
        this.id = id;
        this.userEmail = userEmail;
        this.starRating = starRating;
        this.sentiment = sentiment;
        this.title = title;
        this.text = text;
        this.response = response;
        this.productName = productName;
    }

    public int getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public int getStarRating() { return starRating; }
    public String getSentiment() { return sentiment; }
    public String getTitle() { return title; }
    public String getText() { return text; }
    public String getResponse() { return response; }
    public String getProductName() { return productName; }

    public void setId(int id) { this.id = id; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setStarRating(int starRating) { this.starRating = starRating; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public void setTitle(String title) { this.title = title; }
    public void setText(String text) { this.text = text; }
    public void setResponse(String response) { this.response = response; }
    public void setProductName(String productName) { this.productName = productName; }
}
