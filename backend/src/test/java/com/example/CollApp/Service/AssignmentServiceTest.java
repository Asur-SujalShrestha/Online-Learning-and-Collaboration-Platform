package com.example.CollApp.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.AssignmenDTO;
import com.example.CollApp.Model.*;
import com.example.CollApp.Repository.*;
import com.example.CollApp.Service.Interface.Implementation.AssignmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AssignmentServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ProgramRepository programRepository;
    @Mock private AssignmentRepository assignmentRepository;
    @Mock private Cloudinary cloudinary;
    @Mock private AssignmentFileRepository assignmentFileRepository;

    @InjectMocks private AssignmentService assignmentService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        Uploader uploader = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(), anyMap())).thenReturn(Map.of("url", "http://mock.cloudinary/file.jpg"));
    }

    @Test
    void testAddNewAssignment_Success() throws IOException {
        AssignmenDTO dto = AssignmenDTO.builder()
                .title("Assignment 1")
                .description("Write unit tests")
                .uploadedDate(new Date(System.currentTimeMillis()))
                .dueDate(new Date(System.currentTimeMillis() + 86400000))
                .userId(1L)
                .programId(1L)
                .build();

        Users user = new Users(); user.setId(1L);
        Programs program = new Programs(); program.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(programRepository.findById(1L)).thenReturn(Optional.of(program));

        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "data".getBytes());

        ResponseEntity<String> response = assignmentService.addNewAssignment(dto, List.of(file));

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("Assignment Added", response.getBody());

        verify(assignmentRepository).save(any());
        verify(assignmentFileRepository).save(any());

        System.out.println("✅ Assignment added response: " + response.getBody());
    }

    @Test
    void testAddNewAssignment_UserNotFound() {
        AssignmenDTO dto = AssignmenDTO.builder().userId(1L).programId(2L).build();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(NoSuchElementException.class,
                () -> assignmentService.addNewAssignment(dto, List.of()));

        System.out.println("❌ Assignment creation failed: " + ex.getMessage());
    }

    @Test
    void testAddNewAssignment_ProgramNotFound() {
        AssignmenDTO dto = AssignmenDTO.builder().userId(1L).programId(2L).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(new Users()));
        when(programRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(NoSuchElementException.class,
                () -> assignmentService.addNewAssignment(dto, List.of()));

        System.out.println("❌ Assignment creation failed: " + ex.getMessage());
    }

    @Test
    void testDeleteAssignment_Success() {
        Assignments assignment = new Assignments(); assignment.setId(1L);
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));

        ResponseEntity<String> response = assignmentService.deleteAssignment(1L);

        assertEquals("Assignment Deleted", response.getBody());
        verify(assignmentRepository).delete(assignment);
        System.out.println("🗑️ Assignment deleted: " + response.getBody());
    }

    @Test
    void testDeleteAssignment_NotFound() {
        when(assignmentRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(NoSuchElementException.class,
                () -> assignmentService.deleteAssignment(999L));

        System.out.println("❌ Assignment delete failed: " + ex.getMessage());
    }

    @Test
    void testGetAllAssignment() {
        when(assignmentRepository.findAll()).thenReturn(List.of(new Assignments(), new Assignments()));

        ResponseEntity<List<Assignments>> response = assignmentService.getAllAssignment();

        assertEquals(2, response.getBody().size());
        assertEquals(200, response.getStatusCodeValue());
        System.out.println("📚 Assignments fetched: " + response.getBody().size());
    }

    @Test
    void testGetAssignmentByProgram() {
        Programs program = new Programs(); program.setId(10L);
        when(programRepository.findById(10L)).thenReturn(Optional.of(program));
        when(assignmentRepository.findByProgram(program)).thenReturn(List.of(new Assignments(), new Assignments()));

        ResponseEntity<List<Assignments>> response = assignmentService.getAssignment(10L);

        assertEquals(2, response.getBody().size());
        System.out.println("🏷️ Assignments by program: " + response.getBody().size());
    }
}
