package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
public class PostLikes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long likeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId", nullable = false)
    @JsonBackReference
    private Posts posts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private Users users;

    public PostLikes(long likeId, Posts posts, Users users) {
        this.likeId = likeId;
        this.posts = posts;
        this.users = users;
    }

    public PostLikes() {
    }

    public long getLikeId() {
        return likeId;
    }

    public void setLikeId(long likeId) {
        this.likeId = likeId;
    }

    public Posts getPosts() {
        return posts;
    }

    public void setPosts(Posts posts) {
        this.posts = posts;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    // Builder Class
    public static class PostLikesBuilder {
        private long likeId;
        private Posts posts;
        private Users users;

        public PostLikesBuilder() {
        }

        public PostLikesBuilder likeId(long likeId) {
            this.likeId = likeId;
            return this;
        }

        public PostLikesBuilder posts(Posts posts) {
            this.posts = posts;
            return this;
        }

        public PostLikesBuilder users(Users users) {
            this.users = users;
            return this;
        }

        public PostLikes build() {
            return new PostLikes(this.likeId, this.posts, this.users);
        }
    }

    // Static method to get a new builder instance
    public static PostLikesBuilder builder() {
        return new PostLikesBuilder();
    }
}
