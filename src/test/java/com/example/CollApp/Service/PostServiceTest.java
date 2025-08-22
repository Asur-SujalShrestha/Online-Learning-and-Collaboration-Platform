package com.example.CollApp.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.PostDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.PostRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.sql.Date;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    @Mock private PostRepository postRepository;
    @Mock private UserRepository userRepository;
    @Mock private OrganizationRepository organizationRepository;
    @Mock private Cloudinary cloudinary;

    @InjectMocks private PostService postService;

    @BeforeEach
    void setup() throws Exception {
        MockitoAnnotations.openMocks(this);

        // ✅ mock uploader for Cloudinary
        Uploader uploaderMock = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(uploaderMock);
        when(uploaderMock.upload(any(byte[].class), anyMap()))
                .thenReturn(Map.of("url", "http://cloudinary.com/test.jpg"));
    }

    @Test
    void testSavePost_Success() {
        PostDTO dto = new PostDTO();
        dto.setCaption("Test caption");
        dto.setDate("2025-04-19");
        dto.setLikeCount(5);
        dto.setOrganizationId(1L);

        Users user = new Users(); user.setEmail("test@example.com");
        Organizations org = new Organizations(); org.setId(1L);
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "data".getBytes());

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));

        ResponseEntity<String> response = postService.savePost("test@example.com", dto, file);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Post Uploaded Successfully", response.getBody());

        System.out.println("✅ Save post response: " + response.getBody());
    }

    @Test
    void testSavePost_UserNotFound() {
        PostDTO dto = new PostDTO();
        dto.setOrganizationId(1L); // required
        dto.setDate("2025-04-19");

        // ✅ User is null
        when(userRepository.findByEmail("missing@example.com")).thenReturn(null);

        // ✅ Mock organization to avoid exception
        Organizations org = new Organizations(); org.setId(1L);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));

        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "data".getBytes());

        ResponseEntity<String> response = postService.savePost("missing@example.com", dto, file);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("User not Found", response.getBody());

        System.out.println("❌ Save post failed: " + response.getBody());
    }


    @Test
    void testDeletePost_Success() {
        Posts post = new Posts(); post.setId(1L);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        ResponseEntity<String> response = postService.deletePost(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Post Deleted Successfully", response.getBody());

        System.out.println("🗑️ Delete post response: " + response.getBody());
    }

    @Test
    void testDeletePost_NotFound() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = postService.deletePost(99L);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Post Not Found", response.getBody());

        System.out.println("❌ Delete post failed: " + response.getBody());
    }

    @Test
    void testGetAllPost() {
        when(postRepository.findAll()).thenReturn(List.of(new Posts(), new Posts()));

        List<Posts> posts = postService.getAllPost();

        assertEquals(2, posts.size());
        System.out.println("📰 Total posts fetched: " + posts.size());
    }

    @Test
    void testGetPost_Success() {
        Posts post = new Posts(); post.setId(1L);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Posts result = postService.getPost(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        System.out.println("📌 Post fetched ID: " + result.getId());
    }

    @Test
    void testGetPost_NotFound() {
        when(postRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> postService.getPost(404L));
        System.out.println("❌ Post not found exception thrown as expected");
    }

    @Test
    void testGetPostByOrganization_Success() {
        Organizations org = new Organizations(); org.setId(1L);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));
        when(postRepository.findByOrganizations(org)).thenReturn(List.of(new Posts(), new Posts()));

        List<Posts> posts = postService.getPostByOrganization(1L);

        assertEquals(2, posts.size());
        System.out.println("🏛️ Posts by org: " + posts.size());
    }

    @Test
    void testGetPostByOrganization_NotFound() {
        when(organizationRepository.findById(500L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> postService.getPostByOrganization(500L));

        assertEquals("Organization not found", ex.getMessage());
        System.out.println("❌ Org not found error: " + ex.getMessage());
    }
}
