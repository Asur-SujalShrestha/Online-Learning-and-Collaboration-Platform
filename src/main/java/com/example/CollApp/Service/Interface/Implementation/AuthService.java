package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.ResponseDTO;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }
    public ResponseDTO GenerateToken(Users user){
        if(userRepository.findByEmail(user.getEmail())==null){
            throw new UsernameNotFoundException("User not found");
        }
        if (user.getEmail().isEmpty() || user.getPassword().isEmpty()){
            throw new BadCredentialsException("Email or Password is empty");
        }
        Authentication manager = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(manager);
    }
}
