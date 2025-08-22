package com.example.CollApp.Service;

import com.example.CollApp.DTO.OrganizationDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.OrganizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrganizationServiceTest {

    @Mock private OrganizationRepository organizationRepository;
    @Mock private UserRepository userRepository;
    @Mock private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks private OrganizationService organizationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterOrganization_AlreadyExists() {
        OrganizationDTO dto = new OrganizationDTO();
        dto.setEmail("org@example.com");

        when(organizationRepository.findByEmail("org@example.com")).thenReturn(new Organizations());

        ResponseEntity<String> response = organizationService.registerOrganization(dto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Organization Already registered in this Email.", response.getBody());
        System.out.println("❌ Register org failed: " + response.getBody());
    }

    @Test
    void testRegisterOrganization_Success() {
        OrganizationDTO dto = OrganizationDTO.builder()
                .organizationName("Islington")
                .email("islington@example.com")
                .address("KTM")
                .phone("9800000000")
                .firstName("Sujal")
                .lastName("Shrestha")
                .password("password")
                .dob(LocalDate.of(2000, 1, 1))
                .profilePic("img.jpg")
                .build();

        when(organizationRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(passwordEncoder.encode("password")).thenReturn("hashed");

        ResponseEntity<String> response = organizationService.registerOrganization(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("submitted successfully"));

        verify(organizationRepository).save(any());
        verify(userRepository).save(any());

        System.out.println("✅ Register org response: " + response.getBody());
    }

    @Test
    void testAcceptOrganization_Success() {
        Organizations org = new Organizations(); org.setId(1L);

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));

        organizationService.acceptOrganization(1L, "Approved");

        assertEquals("Approved", org.getStatus());
        verify(organizationRepository).save(org);

        System.out.println("✅ Org approval status set to: " + org.getStatus());
    }

    @Test
    void testAcceptOrganization_NotFound() {
        when(organizationRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> organizationService.acceptOrganization(999L, "Approved"));

        assertEquals("Organization not Found", ex.getMessage());
        System.out.println("❌ Org approval failed: " + ex.getMessage());
    }
}
