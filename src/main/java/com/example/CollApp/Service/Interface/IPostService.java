package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.PostDTO;
import com.example.CollApp.Model.Posts;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPostService {
    public ResponseEntity<String> savePost(String email, PostDTO post, MultipartFile file);
    public ResponseEntity<String> deletePost(long id);
    public List<Posts> getAllPost();

    Posts getPost(long id);
}
