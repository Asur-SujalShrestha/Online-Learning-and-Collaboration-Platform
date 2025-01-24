package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.LoginDTO;
import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.Model.Users;

public interface IUserService {
    Users registerUser(RegisterDTO user);

    Users loginUser(LoginDTO loginDTO);
}
