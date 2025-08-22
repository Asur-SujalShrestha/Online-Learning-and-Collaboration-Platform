package com.example.CollApp.Controller;

import com.example.CollApp.Service.Interface.Implementation.PostLikesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/collapp/post-like")
@CrossOrigin
public class PostLikesController {

    private final PostLikesService postLikesService;

    public PostLikesController(PostLikesService postLikesService) {
        this.postLikesService = postLikesService;
    }

    //http://localhost:8081/collapp/post-like/3/3
    @PostMapping("/{postId}/{userId}")
    public ResponseEntity<String> postLike(@PathVariable long postId, @PathVariable long userId) {
        return postLikesService.postLike(postId, userId);
    }
}
