package com.example.CollApp.Service;

import com.example.CollApp.DTO.InsertProgramDTO;
import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.ProgramRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.ProgramService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProgramServiceTest {

    @Mock private ProgramRepository programRepository;
    @Mock private UserRepository userRepository;
    @Mock private OrganizationRepository organizationRepository;

    @InjectMocks private ProgramService programService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewProgram_Success() {
        InsertProgramDTO dto = new InsertProgramDTO();
        dto.setName("BCA");
        dto.setOrganizationId(1L);

        Organizations org = new Organizations();
        org.setId(1L);

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));

        ResponseEntity<String> response = programService.addNewProgram(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Program added", response.getBody());

        System.out.println("✅ Add program response: " + response.getBody());
    }

    @Test
    void testAddNewProgram_OrgNotFound() {
        InsertProgramDTO dto = new InsertProgramDTO();
        dto.setOrganizationId(100L);

        when(organizationRepository.findById(100L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> programService.addNewProgram(dto));
        assertEquals("Organization Not Found", ex.getMessage());

        System.out.println("❌ Add program failed: " + ex.getMessage());
    }

    @Test
    void testDeleteProgram_Success() {
        Programs program = new Programs();
        program.setId(1L);

        when(programRepository.findById(1L)).thenReturn(Optional.of(program));

        ResponseEntity<String> response = programService.deleteProgram(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Program deleted", response.getBody());

        System.out.println("🗑️ Delete program response: " + response.getBody());
    }

    @Test
    void testDeleteProgram_NotFound() {
        when(programRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> programService.deleteProgram(2L));
    }

    @Test
    void testGetAllPrograms() {
        Programs p1 = new Programs(); p1.setName("BIM");
        Programs p2 = new Programs(); p2.setName("BBA");

        when(programRepository.findAll()).thenReturn(List.of(p1, p2));

        ResponseEntity<List<ProgramDTO>> response = programService.getAllPrograms();

        assertEquals(2, response.getBody().size());

        System.out.println("📚 Programs fetched: " + response.getBody().size());
    }

    @Test
    void testGetProgramByUserId_Success() {
        Users user = new Users(); user.setId(1L);
        Programs program = new Programs(); program.setName("BIT");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(programRepository.findByUser(user)).thenReturn(List.of(program));

        ResponseEntity<List<ProgramDTO>> response = programService.getProgramByUserId(1L);

        assertEquals(1, response.getBody().size());
        System.out.println("👤 Programs for user: " + response.getBody().size());
    }

    @Test
    void testGetProgramByProgramId() {
        Programs program = new Programs(); program.setName("MBA");

        when(programRepository.findById(1L)).thenReturn(Optional.of(program));

        ResponseEntity<List<ProgramDTO>> response = programService.getProgramByProgramId(1L);

        assertEquals(1, response.getBody().size());
        System.out.println("🎓 Program by ID: " + response.getBody().get(0).getName());
    }

    @Test
    void testGetProgramByOrganization_Success() {
        Organizations org = new Organizations(); org.setId(1L);

        Users u1 = new Users(); u1.setId(1L);
        Programs p1 = new Programs(); p1.setName("BCA"); p1.setMembers(List.of());
        Programs p2 = new Programs(); p2.setName("BBS"); p2.setMembers(List.of());

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));
        when(programRepository.findByOrganization(org)).thenReturn(List.of(p1, p2));

        List<ProgramDTO> result = programService.getProgramByOrganization(1L);

        assertEquals(2, result.size());
        System.out.println("🏛️ Programs in org: " + result.size());
    }


    @Test
    void testGetProgramByOrganization_NotFound() {
        when(organizationRepository.findById(404L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> programService.getProgramByOrganization(404L));
        assertEquals("Organization not found", ex.getMessage());
        System.out.println("❌ Org fetch failed: " + ex.getMessage());
    }
}
