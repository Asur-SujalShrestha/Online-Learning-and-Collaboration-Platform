package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.OrganizationDTO;
import org.springframework.http.ResponseEntity;

public interface IOrganizationService {
    ResponseEntity<String> registerOrganization(OrganizationDTO organizationDTO);

    void acceptOrganization(long organizationId, String status);
}
