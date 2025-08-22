package com.example.CollApp.Controller;

import com.example.CollApp.Config.JwtAuthenticationFilter;
import com.example.CollApp.Config.JwtTokenProvider;
import com.example.CollApp.DTO.LoginDTO;
import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.DTO.ResponseDTO;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Service.Interface.IUserService;
import com.example.CollApp.Service.Interface.Implementation.AuthService;
import com.example.CollApp.Service.Interface.Implementation.UserService;
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
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(UserControllerTest.MockSecurityConfig.class)
class UserControllerTest {


    @Autowired
    private MockMvc mockMvc;



    @MockBean
    private IUserService userService; // ✅ now works because controller uses interface

    @MockBean
    private AuthService authService;


    @TestConfiguration
    static class MockSecurityConfig {
        @Bean
        public JwtTokenProvider jwtTokenProvider() {
            return Mockito.mock(JwtTokenProvider.class);
        }

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter() {
            return Mockito.mock(JwtAuthenticationFilter.class);
        }
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("sujal@shrestha.com");
        dto.setFirstName("Sujal");
        dto.setLastName("Shrestha");
        dto.setDob("2003-01-14");
        dto.setPassword("password");
        dto.setAddress("Kathmandu");
        dto.setRole("USER");
        dto.setOrganizationId(1L);

        Users mockUser = new Users();
        mockUser.setId(1L);
        mockUser.setEmail("sujal@shrestha.com");

        when(userService.registerUser(Mockito.any(RegisterDTO.class))).thenReturn(mockUser);

        var result = mockMvc.perform(post("/collapp/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        System.out.println("Register Response: " + result.getResponse().getContentAsString());
    }


    @Test
    void testRegisterUser_Fail_EmailExists() throws Exception {
        Mockito.doThrow(new RuntimeException("Email already registered"))
                .when(userService).registerUser(Mockito.any());

        var result = mockMvc.perform(post("/collapp/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(new RegisterDTO())))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already registered"))
                .andReturn(); // 👈 Needed to access response

        System.out.println("❌ Register failed response: " + result.getResponse().getContentAsString());
    }

    @Test
    void testLoginUser_Success() throws Exception {
        LoginDTO loginDTO = new LoginDTO("sujal@shrestha.com", "pass");
        ResponseDTO response = new ResponseDTO("USER", "token");

        when(authService.generateToken(Mockito.any())).thenReturn(response);

        var result = mockMvc.perform(post("/collapp/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"))
                .andReturn();
        System.out.println("Login result response: " + result.getResponse().getContentAsString());
    }

    @Test
    void testGetAllUsers() throws Exception {
        Users user1 = new Users();
        user1.setId(1L);
        user1.setEmail("sujal@shrestha.com");
        user1.setFirstName("Sujal");
        user1.setLastName("Shrestha");
        user1.setDob(LocalDate.now());
        user1.setPassword("password");
        user1.setAddress("Kathmandu");
        user1.setRole("USER");

        Users user2 = new Users();
        user2.setId(2L);
        user2.setEmail("Ram@shrestha.com");
        user2.setFirstName("Ram");
        user2.setLastName("Shrestha");
        user2.setDob(LocalDate.now());
        user2.setPassword("password");
        user2.setAddress("Kathmandu");
        user2.setRole("USER");

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        var result = mockMvc.perform(get("/collapp/users/all-user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andReturn();

        System.out.println("✅ All Users response: " + result.getResponse().getContentAsString());
    }


    @Test
    void testUpdateUserRole() throws Exception {
        var result = mockMvc.perform(put("/collapp/users/update-user-role/1")
                        .content("ADMIN")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("User's role updated successfully."))
                .andReturn();
        System.out.println("Update Role response: " + result.getResponse().getContentAsString());
    }
}
