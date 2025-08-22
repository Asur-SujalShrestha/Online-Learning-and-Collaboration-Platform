package com.example.CollApp.Controller;

import com.example.CollApp.DTO.OrganizationDTO;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Service.Interface.Implementation.OrganizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/organization")
@CrossOrigin
public class OrganizationController {
    private final OrganizationService organizationService;
    private final OrganizationRepository organizationRepository;

    public OrganizationController(OrganizationService organizationService, OrganizationRepository organizationRepository) {
        this.organizationService = organizationService;
        this.organizationRepository = organizationRepository;
    }

    @PostMapping("/register-organization")
    public ResponseEntity<String> registerOrganization(@RequestBody OrganizationDTO organizationDTO) {
        return organizationService.registerOrganization(organizationDTO);
    }

    //https://192.168.101.3:8081/collapp/organization/get-all-organization
    @GetMapping("/get-all-organization")
    public ResponseEntity<List<Organizations>> getAllOrganization() {
        return new ResponseEntity<>(organizationRepository.findAll(), HttpStatus.OK);
    }

    @PutMapping("/update-organization/{organizationId}")
    public ResponseEntity<String> updateOrganization(@RequestBody String status, @PathVariable long organizationId) {
        organizationService.acceptOrganization(organizationId, status);
        return ResponseEntity.ok("Organization updated successfully");
    }
}
