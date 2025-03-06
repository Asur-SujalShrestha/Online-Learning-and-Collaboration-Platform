package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.Model.Groups;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IGroupService {
    ResponseEntity<String> addNewGroup(Groups group);

    ResponseEntity<List<GroupDTO>> getAllGroups();

    ResponseEntity<String> deleteGroup(long groupId);

}
