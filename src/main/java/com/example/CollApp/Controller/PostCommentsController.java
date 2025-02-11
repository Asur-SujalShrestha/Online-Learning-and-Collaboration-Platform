package com.example.CollApp.Controller;

import com.example.CollApp.DTO.PostCommentsDto;
import com.example.CollApp.Service.Interface.Implementation.PostCommentsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/collapp/post-comment")
@CrossOrigin("http://localhost:5173")
public class PostCommentsController {
    private final PostCommentsService postCommentsService;

    public PostCommentsController(PostCommentsService postCommentsService) {
        this.postCommentsService = postCommentsService;
    }

    //http://localhost:8081/collapp/post-comment/3/3
    @PostMapping("/{postId}/{userId}")
    public ResponseEntity<String> commentPost(@RequestBody PostCommentsDto postCommentsDto, @PathVariable long postId, @PathVariable long userId) {
        return postCommentsService.commentPost(postCommentsDto, postId, userId);
    }
}
