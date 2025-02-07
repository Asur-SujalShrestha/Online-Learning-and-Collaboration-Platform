package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.PostDTO;
import com.example.CollApp.Model.Posts;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface IPostService {
    public ResponseEntity<String> savePost(String email, PostDTO post, MultipartFile file);
}
