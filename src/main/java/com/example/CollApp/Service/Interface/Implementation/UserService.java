package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.LoginDTO;
import com.example.CollApp.DTO.RegisterDTO;
import com.example.CollApp.DTO.ResponseDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IUserService;
import org.springframework.context.annotation.Primary;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Primary
public class UserService implements IUserService, UserDetailsService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OrganizationRepository organizationRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.organizationRepository = organizationRepository;
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
        Users existingUser = userRepository.findByEmail(user.getEmail());
        Organizations organization = organizationRepository.findById(user.getOrganizationId()).orElseThrow(()->new RuntimeException("Organization not found"));
        if (existingUser != null) {
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
        users.setOrganization(organization);
        users.setProfilePic(user.getProfilePic());
        return userRepository.save(users);
    }

    @Override
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<Users> getUserByOrganization(long organizationId) {
        Organizations organizations = organizationRepository.findById(organizationId).orElseThrow(()-> new RuntimeException("Organization not Found"));

        return userRepository.findByOrganization(organizations);
    }

    @Override
    public void updateRole(long userId, String role) {
        Users user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not Found"));
        user.setRole(role);
        userRepository.save(user);
    }


}
