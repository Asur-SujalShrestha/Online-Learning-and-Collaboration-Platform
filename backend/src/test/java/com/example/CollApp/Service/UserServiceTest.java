package com.example.CollApp.Service;

import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        RegisterDTO dto = RegisterDTO.builder()
                .firstName("Sujal")
                .lastName("Shrestha")
                .email("sujal@example.com")
                .password("password123")
                .dob("2003-01-14")
                .role("USER")
                .address("Kathmandu")
                .organizationId(1L)
                .build();

        Organizations org = new Organizations();
        org.setId(1L);

        when(userRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Users saved = userService.registerUser(dto);

        System.out.println("✅ Registered user: " + saved.getFirstName() + ", Email: " + saved.getEmail());

        assertEquals("Sujal", saved.getFirstName());
        assertEquals("hashedPassword", saved.getPassword());
        assertEquals(org, saved.getOrganization());
    }


    @Test
    void testRegisterUser_EmailExists() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("duplicate@example.com");
        dto.setOrganizationId(1L);

        when(userRepository.findByEmail("duplicate@example.com")).thenReturn(new Users());
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(new Organizations()));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.registerUser(dto));

        System.out.println("❌ Registration failed: " + exception.getMessage());

        assertEquals("Email is already registered.", exception.getMessage());
    }



    @Test
    void testRegisterUser_OrganizationNotFound() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("user@example.com");
        dto.setOrganizationId(99L);

        when(userRepository.findByEmail("user@example.com")).thenReturn(null);
        when(organizationRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.registerUser(dto));

        assertEquals("Organization not found", exception.getMessage());

        // ✅ Print the exception message
        System.out.println("❌ Registration failed: " + exception.getMessage());
    }

    @Test
    void testGetAllUsers() {
        List<Users> mockList = List.of(new Users(), new Users());

        when(userRepository.findAll()).thenReturn(mockList);

        List<Users> result = userService.getAllUsers();

        System.out.println("📦 Fetched users count: " + result.size());

        assertEquals(2, result.size());
    }


    @Test
    void testGetUserByOrganization() {
        long orgId = 5L;
        Organizations org = new Organizations();
        org.setId(orgId); // optional but cleaner

        List<Users> expectedUsers = List.of(new Users(), new Users());

        when(organizationRepository.findById(orgId)).thenReturn(Optional.of(org));
        when(userRepository.findByOrganization(org)).thenReturn(expectedUsers);

        List<Users> result = userService.getUserByOrganization(orgId);

        assertEquals(expectedUsers, result);

        System.out.println("👥 Users found for organization ID " + orgId + ": " + result.size());
    }


    @Test
    void testGetUserByOrganization_NotFound() {
        long orgId = 1L;

        when(organizationRepository.findById(orgId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.getUserByOrganization(orgId));

        assertEquals("Organization not Found", exception.getMessage());

        // ✅ Console output for visibility
        System.out.println("❌ Fetch failed: " + exception.getMessage());
    }


    @Test
    void testUpdateRole() {
        Users user = new Users();
        user.setRole("USER");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.updateRole(1L, "ADMIN");

        System.out.println("🔁 Role updated to: " + user.getRole());

        assertEquals("ADMIN", user.getRole());
        verify(userRepository).save(user);
    }


    @Test
    void testUpdateRole_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.updateRole(1L, "ADMIN"));

        assertEquals("User not Found", exception.getMessage());

        // ✅ Print the result
        System.out.println("❌ Role update failed: " + exception.getMessage());
    }


    @Test
    void testLoadUserByUsername_Success() {
        Users user = new Users();
        user.setEmail("sujal@example.com");
        user.setPassword("pass");
        user.setRole("USER");

        when(userRepository.findByEmail("sujal@example.com")).thenReturn(user);

        UserDetails userDetails = userService.loadUserByUsername("sujal@example.com");

        System.out.println("🔐 Loaded user: " + userDetails.getUsername() + ", Role: " + user.getRole());

        assertEquals("sujal@example.com", userDetails.getUsername());
        assertEquals("pass", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("USER")));
    }


    @Test
    void testLoadUserByUsername_NotFound() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(null);

        UsernameNotFoundException ex = assertThrows(UsernameNotFoundException.class,
                () -> userService.loadUserByUsername("unknown@example.com"));

        assertEquals("No User found with email:unknown@example.com", ex.getMessage());

        // ✅ Console log for debug
        System.out.println("❌ Load failed: " + ex.getMessage());
    }

}
