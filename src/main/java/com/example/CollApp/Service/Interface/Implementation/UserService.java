package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.LoginDTO;
import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IUserService;
import org.springframework.context.annotation.Role;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService, UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail((username));
        if(user == null) {
            throw new UsernameNotFoundException("No User found with email:"+username);
        }
        return new org.springframework.security.core.userdetails.User(username, user.getPassword(), getAuthority(user));
    }

    private Set<SimpleGrantedAuthority> getAuthority(Users user) {
        return Set.of( new SimpleGrantedAuthority(user.getRole().toUpperCase()));
    }

    @Override
    public Users registerUser(RegisterDTO user) {
        Optional<Users> existingUser = Optional.ofNullable(userRepository.findByEmail(user.getEmail()));
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }
        Users users = new Users();
        users.setFirstName(user.getFirstName());
        users.setLastName(user.getLastName());
        users.setDob(LocalDate.parse(user.getDob(), DateTimeFormatter.ISO_DATE));
        users.setEmail(user.getEmail());
        users.setAddress(user.getAddress());
        users.setPassword(passwordEncoder.encode(user.getPassword()));
        users.setRole(user.getRole());
        users.setProfilePic(user.getProfilePic());
        return userRepository.save(users);
    }

    @Override
    public Users loginUser(LoginDTO loginDTO) {
        Users user = userRepository.findByEmail(loginDTO.getEmail());

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password.");
        }
        return user;
    }


}
