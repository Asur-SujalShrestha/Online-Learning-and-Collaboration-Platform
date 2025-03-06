package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.GroupRepository;
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

    public GroupService(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<String> addNewGroup(Groups group) {
        groupRepository.save(group);
        return ResponseEntity.ok("New Group Created");
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


}
