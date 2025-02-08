package com.example.CollApp.Service.Interface.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.PostDTO;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.PostRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IPostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostService implements IPostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    public PostService(PostRepository postRepository, UserRepository userRepository, Cloudinary cloudinary) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file){
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString(); // Returns the uploaded image URL
        }
        catch (Exception e){
            throw new RuntimeException("Image upload failed");
        }
    }

    @Override
    public ResponseEntity<String> savePost(String email, PostDTO postDto, MultipartFile file) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("User not Found", HttpStatus.NOT_FOUND);
        }
        String fileURL = uploadImage(file);

        Posts post = new Posts();
        post.setCaption(postDto.getCaption());
        post.setDate(Date.valueOf(postDto.getDate()));
        post.setFileUrl(fileURL);
        post.setLikeCount(postDto.getLikeCount());
        post.setUser(user);
        postRepository.save(post);
        return ResponseEntity.ok("Post Uploaded Successfully");
    }

    @Override
    public ResponseEntity<String> deletePost(long id) {
        Optional<Posts> post = postRepository.findById(id);
        post.ifPresent(postRepository::delete);
        return ResponseEntity.ok("Post Deleted Successfully");
    }

    @Override
    public List<Posts> getAllPost() {
        return postRepository.findAll();

    }
}
