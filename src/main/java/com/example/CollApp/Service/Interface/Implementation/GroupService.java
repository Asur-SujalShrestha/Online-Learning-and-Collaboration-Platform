package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.InsertGroupDTO;
import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.GroupRepository;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService implements IGroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository, OrganizationRepository organizationRepository, OrganizationRepository organizationRepository1) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository1;
    }

    @Override
    public ResponseEntity<Long> addNewGroup(InsertGroupDTO insertGroupDTO) {
        Organizations organizations = organizationRepository.findById(insertGroupDTO.getOrganizationId()).orElseThrow(()-> new RuntimeException("Organization Not Found"));
        Groups group = Groups.builder()
                        .name(insertGroupDTO.getName())
                                .organization(organizations)
                                        .build();
        groupRepository.save(group);
        return ResponseEntity.ok(group.getId());
    }

    @Override
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        List<GroupDTO> groupDTOs = groupRepository.findAll().stream()
                .map(GroupDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(groupDTOs);
    }

    @Override
    public ResponseEntity<String> deleteGroup(long groupId) {
        Groups group = groupRepository.findById(groupId).get();
        groupRepository.delete(group);
        return ResponseEntity.ok("Group Deleted");
    }

    @Override
    public List<GroupDTO> getGroupByOrganization(long organizationId) {
        Organizations organization = organizationRepository.findById(organizationId).orElseThrow(()-> new RuntimeException("Organization Not Found"));
        List<GroupDTO> groupDTOs = groupRepository.findByOrganization(organization).stream()
                .map(GroupDTO::new)
                .collect(Collectors.toList());
        return groupDTOs;
    }


}
