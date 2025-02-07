package com.example.CollApp.DTO;

import java.sql.Date;

public class PostDTO {
    private String date;
    private String caption;
    private int likeCount;

    public PostDTO() {
    }

    public PostDTO( String date, String caption, int likeCount) {
        this.date = date;
        this.caption = caption;
        this.likeCount = likeCount;
    }


    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
}
