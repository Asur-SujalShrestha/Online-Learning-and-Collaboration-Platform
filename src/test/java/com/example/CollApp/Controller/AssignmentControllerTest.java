package com.example.CollApp.Controller;

import com.example.CollApp.Config.JwtAuthenticationFilter;
import com.example.CollApp.Config.JwtTokenProvider;
import com.example.CollApp.DTO.AssignmenDTO;
import com.example.CollApp.Model.Assignments;
import com.example.CollApp.Service.Interface.IAssignmentService;
import com.example.CollApp.Service.Interface.Implementation.AssignmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AssignmentController.class)
@AutoConfigureMockMvc(addFilters = false) // disables JwtAuthenticationFilter
@Import(AssignmentControllerTest.SecurityMocks.class)
class AssignmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IAssignmentService assignmentService;

    @TestConfiguration
    static class SecurityMocks {

        @Bean
        public JwtTokenProvider jwtTokenProvider() {
            return Mockito.mock(JwtTokenProvider.class);
        }

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter() {
            return Mockito.mock(JwtAuthenticationFilter.class);
        }
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldReturnSuccess() throws Exception {
        when(assignmentService.getAllAssignment()).thenReturn(ResponseEntity.ok(List.of()));

        mockMvc.perform(get("/collapp/assignment/get-all-assignment"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddNewAssignment() throws Exception {
        AssignmenDTO dto = AssignmenDTO.builder()
                .title("Test Title")
                .description("Test Desc")
                .uploadedDate(new Date())
                .dueDate(new Date())
                .programId(1L)
                .userId(2L)
                .build();

        MockMultipartFile jsonPart = new MockMultipartFile(
                "AssignmentDetail",
                "",
                "application/json",
                objectMapper.writeValueAsBytes(dto)
        );

        MockMultipartFile filePart = new MockMultipartFile(
                "files",
                "test.txt",
                "text/plain",
                "Dummy file content".getBytes()
        );

        when(assignmentService.addNewAssignment(Mockito.any(), Mockito.any()))
                .thenReturn(ResponseEntity.ok("Assignment uploaded"));

        var result = mockMvc.perform(multipart("/collapp/assignment/add-assignment")
                        .file(jsonPart)
                        .file(filePart))
                .andExpect(status().isOk())
                .andExpect(content().string("Assignment uploaded"))
                .andReturn();

        System.out.println("✅ Add assignment response: " + result.getResponse().getContentAsString());
    }

    @Test
    void testGetAllAssignments() throws Exception {
        when(assignmentService.getAllAssignment()).thenReturn(ResponseEntity.ok(List.of(new Assignments(), new Assignments())));

        var result = mockMvc.perform(get("/collapp/assignment/get-all-assignment"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andReturn();

        System.out.println("📚 All Assignments: " + result.getResponse().getContentAsString());
    }

    @Test
    void testDeleteAssignment() throws Exception {
        long assignmentId = 1L;
        when(assignmentService.deleteAssignment(assignmentId)).thenReturn(ResponseEntity.ok("Deleted"));

        var result = mockMvc.perform(delete("/collapp/assignment/delete-assignment/{assignmentId}", assignmentId))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted"))
                .andReturn();

        System.out.println("🗑️ Delete Response: " + result.getResponse().getContentAsString());
    }
}
