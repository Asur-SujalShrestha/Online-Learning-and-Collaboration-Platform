package com.example.CollApp.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.SubmittedAssignmentDTO;
import com.example.CollApp.Model.*;
import com.example.CollApp.Repository.*;
import com.example.CollApp.Service.Interface.Implementation.SubmittedAssignmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubmittedAssignmentServiceTest {

    @Mock private AssignmentRepository assignmentRepository;
    @Mock private UserRepository userRepository;
    @Mock private SubmittedAssignmentRepository submittedAssignmentRepository;
    @Mock private SubmittedAssignmentFileRepository submittedAssignmentFileRepository;
    @Mock private ProgramRepository programRepository;
    @Mock private Cloudinary cloudinary;

    @InjectMocks
    private SubmittedAssignmentService submittedAssignmentService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        // Mock cloudinary uploader to avoid NullPointerException
        Uploader uploaderMock = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(uploaderMock);

        // Mock upload method on uploaderMock to return a valid response
        Map<String, String> cloudinaryResult = Map.of("url", "https://cloudinary.com/test.pdf");
        try {
            when(uploaderMock.upload(any(byte[].class), anyMap())).thenReturn(cloudinaryResult);
        } catch (IOException e) {
            e.printStackTrace(); // Handle exception
        }
    }


    @Test
    void testAddSubmittedAssignment_Success() throws Exception {
        SubmittedAssignmentDTO dto = SubmittedAssignmentDTO.builder()
                .assignmentId(1L)
                .userId(1L)
                .programId(1L)
                .uploadedDate(new Date())
                .description("My submission")
                .build();

        Assignments assignment = new Assignments();
        assignment.setDueDate(new Date(System.currentTimeMillis() + 86400000)); // future date

        Users user = new Users();
        Programs program = new Programs();

        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "hello".getBytes());
        Map<String, String> cloudinaryResult = Map.of("url", "https://cloudinary.com/test.pdf");

        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(programRepository.findById(1L)).thenReturn(Optional.of(program));
        when(cloudinary.uploader().upload(any(byte[].class), anyMap())).thenReturn(cloudinaryResult);
        when(submittedAssignmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        ResponseEntity<String> response = submittedAssignmentService.addSubmittedAssignment(dto, List.of(file));

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("File Submitted Successfully", response.getBody());

        System.out.println("✅ Submission response: " + response.getBody());
    }

    @Test
    void testAddSubmittedAssignment_LateSubmission() throws IOException {
        SubmittedAssignmentDTO dto = SubmittedAssignmentDTO.builder()
                .assignmentId(1L)
                .userId(1L)
                .programId(1L)
                .uploadedDate(new Date(System.currentTimeMillis() + 86400000)) // future submission
                .build();

        Assignments assignment = new Assignments();
        assignment.setDueDate(new Date()); // today

        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(userRepository.findById(1L)).thenReturn(Optional.of(new Users()));
        when(programRepository.findById(1L)).thenReturn(Optional.of(new Programs()));

        ResponseEntity<String> response = submittedAssignmentService.addSubmittedAssignment(dto, new ArrayList<>());

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Submission Date Exceed", response.getBody());

        System.out.println("⚠️ Submission rejected: " + response.getBody());
    }

    @Test
    void testAddSubmittedAssignment_FileUploadFails() throws Exception {
        SubmittedAssignmentDTO dto = SubmittedAssignmentDTO.builder()
                .assignmentId(1L)
                .userId(1L)
                .programId(1L)
                .uploadedDate(new Date())
                .build();

        Assignments assignment = new Assignments();
        assignment.setDueDate(new Date(System.currentTimeMillis() + 86400000)); // future due date

        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(userRepository.findById(1L)).thenReturn(Optional.of(new Users()));
        when(programRepository.findById(1L)).thenReturn(Optional.of(new Programs()));
        when(cloudinary.uploader().upload(any(byte[].class), anyMap())).thenThrow(new IOException("Cloud error"));

        MockMultipartFile file = new MockMultipartFile("file", "fail.pdf", "application/pdf", "bad".getBytes());

        ResponseEntity<String> response = submittedAssignmentService.addSubmittedAssignment(dto, List.of(file));

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("File upload failed"));

        System.out.println("❌ Upload error: " + response.getBody());
    }

    @Test
    void testGetSubmittedAssignment_Success() {
        Assignments assignment = new Assignments();
        List<SubmittedAssignments> submissions = List.of(new SubmittedAssignments(), new SubmittedAssignments());

        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(submittedAssignmentRepository.findByAssignments(assignment)).thenReturn(submissions);

        ResponseEntity<List<SubmittedAssignments>> response = submittedAssignmentService.getSubmittedAssignment(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());

        System.out.println("📨 Submissions for assignment: " + response.getBody().size());
    }

    @Test
    void testGetSubmittedAssignmentByProgram_Success() {
        Programs program = new Programs();
        List<SubmittedAssignments> submissions = List.of(new SubmittedAssignments());

        when(programRepository.findById(1L)).thenReturn(Optional.of(program));
        when(submittedAssignmentRepository.findByProgram(program)).thenReturn(submissions);

        ResponseEntity<List<SubmittedAssignments>> response = submittedAssignmentService.getSubmittedAssignmentByProgram(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());

        System.out.println("📘 Submissions for program: " + response.getBody().size());
    }

    @Test
    void testGetSubmittedAssignment_AssignmentNotFound() {
        when(assignmentRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> submittedAssignmentService.getSubmittedAssignment(99L));

        assertEquals("Assignment Not Found", ex.getMessage());
        System.out.println("❌ Assignment fetch failed: " + ex.getMessage());
    }

    @Test
    void testGetSubmittedAssignmentByProgram_NotFound() {
        when(programRepository.findById(88L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> submittedAssignmentService.getSubmittedAssignmentByProgram(88L));

        assertEquals("Program not Found", ex.getMessage());
        System.out.println("❌ Program fetch failed: " + ex.getMessage());
    }
}
