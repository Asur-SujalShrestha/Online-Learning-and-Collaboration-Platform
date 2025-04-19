package com.example.CollApp.Service;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.InsertGroupDTO;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Repository.GroupRepository;
import com.example.CollApp.Repository.OrganizationRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.GroupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GroupServiceTest {

    @Mock private GroupRepository groupRepository;
    @Mock private UserRepository userRepository;
    @Mock private OrganizationRepository organizationRepository;

    @InjectMocks private GroupService groupService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewGroup_Success() {
        InsertGroupDTO dto = new InsertGroupDTO();
        dto.setName("Team Alpha");
        dto.setOrganizationId(1L);

        Organizations org = new Organizations(); org.setId(1L);

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));

        ResponseEntity<String> response = groupService.addNewGroup(dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("New Group Created", response.getBody());
        verify(groupRepository).save(any());
        System.out.println("✅ Add group: " + response.getBody());
    }

    @Test
    void testAddNewGroup_OrganizationNotFound() {
        InsertGroupDTO dto = new InsertGroupDTO();
        dto.setOrganizationId(404L);

        when(organizationRepository.findById(404L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> groupService.addNewGroup(dto));

        assertEquals("Organization Not Found", ex.getMessage());
        System.out.println("❌ Add group failed: " + ex.getMessage());
    }

    @Test
    void testGetAllGroups() {
        Groups g1 = new Groups(); g1.setName("Team A");
        Groups g2 = new Groups(); g2.setName("Team B");

        when(groupRepository.findAll()).thenReturn(List.of(g1, g2));

        ResponseEntity<List<GroupDTO>> response = groupService.getAllGroups();

        assertEquals(2, response.getBody().size());
        System.out.println("📦 Total groups: " + response.getBody().size());
    }

    @Test
    void testDeleteGroup_Success() {
        Groups group = new Groups(); group.setId(5L);

        when(groupRepository.findById(5L)).thenReturn(Optional.of(group));

        ResponseEntity<String> response = groupService.deleteGroup(5L);

        assertEquals("Group Deleted", response.getBody());
        verify(groupRepository).delete(group);
        System.out.println("🗑️ Group deleted: " + response.getBody());
    }

    @Test
    void testGetGroupByOrganization_Success() {
        Organizations org = new Organizations(); org.setId(1L);
        Groups g1 = new Groups(); g1.setName("Alpha");
        Groups g2 = new Groups(); g2.setName("Beta");

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(org));
        when(groupRepository.findByOrganization(org)).thenReturn(List.of(g1, g2));

        List<GroupDTO> result = groupService.getGroupByOrganization(1L);

        assertEquals(2, result.size());
        System.out.println("🏢 Groups for org: " + result.size());
    }

    @Test
    void testGetGroupByOrganization_OrgNotFound() {
        when(organizationRepository.findById(404L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> groupService.getGroupByOrganization(404L));

        assertEquals("Organization Not Found", ex.getMessage());
        System.out.println("❌ Group fetch failed: " + ex.getMessage());
    }
}
