package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.Config.JwtTokenProvider;
import com.example.CollApp.DTO.LoginDTO;
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

import java.util.stream.Collectors;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    public ResponseDTO generateToken(LoginDTO user){
        Users users = new Users();
        users = userRepository.findByEmail(user.getEmail());
        if(userRepository.findByEmail(user.getEmail())==null){
            throw new UsernameNotFoundException("User not found");
        }
        if (user.getEmail().isEmpty() || user.getPassword().isEmpty()){
            throw new BadCredentialsException("Email or Password is empty");
        }
        Authentication manager = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(manager);
        final String token = jwtTokenProvider.generateToken(manager, users);

        return  ResponseDTO.builder()
                .token(token)
                .role(users.getRole())
                .build();
    }
}
