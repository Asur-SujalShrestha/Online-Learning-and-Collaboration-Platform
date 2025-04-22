package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.LoginDTO;
import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.DTO.ResponseDTO;
import com.example.CollApp.Model.Users;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IUserService {
    Users registerUser(RegisterDTO user);

    List<Users> getAllUsers();

    List<Users> getUserByOrganization(long organizationId);

    void updateRole(long userId, String role);

    Users getUser(long userId);
}
