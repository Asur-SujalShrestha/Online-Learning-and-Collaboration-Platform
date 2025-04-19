package com.example.CollApp.Service;


import com.example.CollApp.DTO.TeacherContentDTO;
import com.example.CollApp.Model.*;
import com.example.CollApp.Repository.*;
import com.example.CollApp.Service.Interface.Implementation.AssignmentFileService;
import com.example.CollApp.Service.Interface.Implementation.TeacherContentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeacherContentServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ProgramRepository programRepository;
    @Mock
    private AssignmentFileService assignmentFileService;
    @Mock
    private TeacherContentRepository teacherContentRepository;
    @Mock
    private TeacherContentFileRepository teacherContentFileRepository;

    @InjectMocks
    private TeacherContentService teacherContentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddContent_Success() throws IOException {
        TeacherContentDTO dto = TeacherContentDTO.builder()
                .title("Lecture 1")
                .uploadedBy(1L)
                .programId(10L)
                .build();

        Users user = new Users();
        Programs program = new Programs();
        TeacherContents content = TeacherContents.builder()
                .title("Lecture 1").programs(program).users(user).build();

        MockMultipartFile file = new MockMultipartFile("files", "test.pdf", "application/pdf", "data".getBytes());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(programRepository.findById(10L)).thenReturn(Optional.of(program));
        when(assignmentFileService.uploadFile(file)).thenReturn("uploaded_test.pdf");

        ResponseEntity<String> response = teacherContentService.addContent(dto, List.of(file));

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Content added successfully", response.getBody());

        System.out.println("✅ Response: " + response.getBody());
    }

    @Test
    void testAddContent_FileUploadFails() throws IOException {
        TeacherContentDTO dto = TeacherContentDTO.builder()
                .title("Lecture 1")
                .uploadedBy(1L)
                .programId(10L)
                .build();

        Users user = new Users();
        Programs program = new Programs();
        MockMultipartFile file = new MockMultipartFile("files", "fail.pdf", "application/pdf", "data".getBytes());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(programRepository.findById(10L)).thenReturn(Optional.of(program));
        when(assignmentFileService.uploadFile(file)).thenThrow(new IOException("Disk full"));

        ResponseEntity<String> response = teacherContentService.addContent(dto, List.of(file));

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("File upload failed"));

        System.out.println("❌ Upload failed response: " + response.getBody());
    }

    @Test
    void testGetContent_Success() {
        TeacherContents content = new TeacherContents();
        content.setId(100L);
        List<TeacherContentFiles> files = List.of(new TeacherContentFiles(), new TeacherContentFiles());

        when(teacherContentRepository.findById(100L)).thenReturn(Optional.of(content));
        when(teacherContentFileRepository.findByTeacherContents(content)).thenReturn(files);

        ResponseEntity<List<TeacherContentFiles>> response = teacherContentService.getContent(100L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());

        System.out.println("📁 Content files fetched: " + response.getBody().size());
    }

    @Test
    void testGetContentByProgram_Success() {
        Programs program = new Programs();
        program.setId(10L);
        List<TeacherContents> contents = List.of(new TeacherContents());

        when(programRepository.findById(10L)).thenReturn(Optional.of(program));
        when(teacherContentRepository.findByPrograms(program)).thenReturn(contents);

        ResponseEntity<List<TeacherContents>> response = teacherContentService.getContentByProgram(10L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());

        System.out.println("📚 Contents fetched for program: " + response.getBody().size());
    }

    @Test
    void testGetContentByProgram_NotFound() {
        when(programRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> teacherContentService.getContentByProgram(99L));

        assertEquals("Program Not Found", ex.getMessage());
        System.out.println("❌ Program fetch failed: " + ex.getMessage());
    }

    @Test
    void testGetContent_NotFound() {
        when(teacherContentRepository.findById(55L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> teacherContentService.getContent(55L));

        assertEquals("Content Not Found", ex.getMessage());
        System.out.println("❌ Content fetch failed: " + ex.getMessage());
    }
}
