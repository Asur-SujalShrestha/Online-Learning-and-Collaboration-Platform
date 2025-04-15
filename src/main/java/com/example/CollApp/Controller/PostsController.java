package com.example.CollApp.Controller;

import com.example.CollApp.DTO.PostDTO;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Service.Interface.Implementation.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("collapp/posts")
@CrossOrigin
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

    @DeleteMapping("/delete/social-media/{id}")
    public ResponseEntity<String> DeletePost(@PathVariable long id) {
        return postService.deletePost(id);
    }

    //http://localhost:8081/collapp/posts/get-post/3
    @GetMapping("/get-post/{id}")
    public Posts getPost(@PathVariable long id) {
        return postService.getPost(id);
    }

    @GetMapping("/get-all/social-media")
    public List<Posts> GetAllPosts() {
        return postService.getAllPost();
    }

    @GetMapping("/get-all-post/{organizationId}")
    public ResponseEntity<List<Posts>> GetAllPostsByOrganization(@PathVariable long organizationId) {
        List<Posts> organizationPost = postService.getPostByOrganization(organizationId);
        return ResponseEntity.ok(organizationPost);
    }
}
