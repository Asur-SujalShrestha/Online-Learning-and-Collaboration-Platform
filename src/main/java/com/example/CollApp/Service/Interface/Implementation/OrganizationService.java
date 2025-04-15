package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.OrganizationDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IOrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService implements IOrganizationService {
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public OrganizationService(OrganizationRepository organizationRepository, UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseEntity<String> registerOrganization(OrganizationDTO organizationDTO) {
        Organizations organizations = organizationRepository.findByEmail(organizationDTO.getEmail());
        if (organizations != null) {
            return new ResponseEntity<>("Organization Already registered in this Email.", HttpStatus.BAD_REQUEST);
        }
        Organizations newOrganization = Organizations.builder()
                .organizationName(organizationDTO.getOrganizationName())
                .phone(organizationDTO.getPhone())
                .email(organizationDTO.getEmail())
                .status("Pending")
                .address(organizationDTO.getAddress())
                .build();
        organizationRepository.save(newOrganization);

        Users user = Users.builder()
                .firstName(organizationDTO.getFirstName())
                .lastName(organizationDTO.getLastName())
                .email(organizationDTO.getEmail())
                .dob(organizationDTO.getDob())
                .address(organizationDTO.getAddress())
                .role("Admin")
                .organization(newOrganization)
                .password(passwordEncoder.encode(organizationDTO.getPassword()))
                .profilePic(organizationDTO.getProfilePic())
                .build();
        userRepository.save(user);
        return ResponseEntity.ok("Your form is submitted successfully. Please wait for admin to approve you registration.");

    }

    @Override
    public void acceptOrganization(long organizationId, String status) {
        Organizations organization = organizationRepository.findById(organizationId).orElseThrow(()-> new RuntimeException("Organization not Found"));
        organization.setStatus(status);
        organizationRepository.save(organization);
    }
}
