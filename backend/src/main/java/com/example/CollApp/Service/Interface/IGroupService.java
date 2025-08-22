package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.InsertGroupDTO;
import com.example.CollApp.Model.Groups;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IGroupService {
    ResponseEntity<Long> addNewGroup(InsertGroupDTO group);

    ResponseEntity<List<GroupDTO>> getAllGroups();

    ResponseEntity<String> deleteGroup(long groupId);

    List<GroupDTO> getGroupByOrganization(long organizationId);
}
