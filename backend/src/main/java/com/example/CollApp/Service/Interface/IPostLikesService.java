package com.example.CollApp.Service.Interface;

import org.springframework.http.ResponseEntity;

public interface IPostLikesService {
    ResponseEntity<String> postLike(long postId, long userId);
}
