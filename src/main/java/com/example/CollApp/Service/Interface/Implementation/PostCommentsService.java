package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.PostCommentsDto;
import com.example.CollApp.Model.PostComments;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.PostCommentsRepository;
import com.example.CollApp.Repository.PostRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IPostCommentsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostCommentsService implements IPostCommentsService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostCommentsRepository postCommentsRepository;

    public PostCommentsService(UserRepository userRepository, PostRepository postRepository, PostCommentsRepository postCommentsRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postCommentsRepository = postCommentsRepository;
    }

    public ResponseEntity<String> commentPost(PostCommentsDto postCommentsDto, long postId, long userId) {
        Users user = userRepository.findById(userId).get();
        Posts post = postRepository.findById(postId).get();

        PostComments postComments = PostComments.builder().user(user).post(post).comment(postCommentsDto.getComments()).build();
        postCommentsRepository.save(postComments);
        return new ResponseEntity<>("Comment posted", HttpStatus.OK);
    }
}
