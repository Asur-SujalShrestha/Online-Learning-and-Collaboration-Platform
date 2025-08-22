package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.Model.PostLikes;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.PostLikesRepository;
import com.example.CollApp.Repository.PostRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IPostLikesService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostLikesService implements IPostLikesService {
    private final PostLikesRepository postLikesRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostLikesService(PostLikesRepository postLikesRepository, PostService postService, PostRepository postRepository, UserRepository userRepository) {
        this.postLikesRepository = postLikesRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<String> postLike(long postId, long userId) {
        Optional<PostLikes> postLikes = postLikesRepository.findByPostIdAndUserId(postId, userId);
        if (postLikes.isPresent()) {
            postLikesRepository.delete(postLikes.get());
            return ResponseEntity.ok("Like Removed from post");
        }
        Posts post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        PostLikes likes = PostLikes.builder().posts(post).users(user).build();
        postLikesRepository.save(likes);
        return ResponseEntity.ok("Like Added to post");
    }
}
