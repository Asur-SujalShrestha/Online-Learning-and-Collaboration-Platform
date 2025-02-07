package com.example.CollApp.Controller;

import com.example.CollApp.DTO.PostDTO;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Service.Interface.Implementation.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("collapp/posts")
public class PostsController {

    private final PostService postService;

    public PostsController(PostService postService) {
        this.postService = postService;
    }

    //http://localhost:8081/collapp/posts/save/social-media/sujalshrestha519@gmail.com
    @PostMapping("/save/social-media/{email}")
    public ResponseEntity<String> SavePost(@PathVariable String email, @RequestPart("postData") PostDTO posts, @RequestParam("media") MultipartFile file) {
        return postService.savePost(email, posts, file);
    }
}
