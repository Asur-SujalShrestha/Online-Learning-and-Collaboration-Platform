package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.PostCommentsDto;
import org.springframework.http.ResponseEntity;

public interface IPostCommentsService {
    ResponseEntity<String> commentPost(PostCommentsDto postCommentsDto, long postId, long userId);
}
