package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class PostComments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonBackReference
    private Posts post;

    private String comment;

    public PostComments() {
    }

    public PostComments(long id, Users user, Posts post, String comment) {
        this.id = id;
        this.user = user;
        this.post = post;
        this.comment = comment;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    public static class PostCommentsBuilder {
        private long id;
        private Users user;
        private Posts post;
        private String comment;

        public PostCommentsBuilder id(long id) {
            this.id = id;
            return this;
        }

        public PostCommentsBuilder user(Users user) {
            this.user = user;
            return this;
        }

        public PostCommentsBuilder post(Posts post) {
            this.post = post;
            return this;
        }

        public PostCommentsBuilder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public PostComments build() {
            return new PostComments(this.id, this.user, this.post, this.comment);
        }
    }

    // Static method to start building
    public static PostCommentsBuilder builder() {
        return new PostCommentsBuilder();
    }
}
