package com.example.CollApp.DTO;

public class PostCommentsDto {
    private String comments;

    public PostCommentsDto(String comments) {
        this.comments = comments;
    }

    public PostCommentsDto() {
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
