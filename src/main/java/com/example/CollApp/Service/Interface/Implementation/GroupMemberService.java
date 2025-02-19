package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.GroupMemberDTO;
import com.example.CollApp.Model.GroupMembers;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.GroupMemberRepository;
import com.example.CollApp.Repository.GroupRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IGroupMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GroupMemberService implements IGroupMemberService {
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    public GroupMemberService(UserRepository userRepository, GroupRepository groupRepository, GroupMemberRepository groupMemberRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Override
    public ResponseEntity<String> addMemeber(GroupMemberDTO groupMemberDTO) {
        Users user = userRepository.findById(groupMemberDTO.getUserId()).get();
        Groups group = groupRepository.findById(groupMemberDTO.getGroupId()).get();
        Optional<GroupMembers> groupMembers = groupMemberRepository.findByGroupAndUser(group, user);
        if(user == null) {
            return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
        }
        if(group == null) {
            return new ResponseEntity<>("Group Not Found", HttpStatus.NOT_FOUND);
        }
        if(groupMembers.isPresent()) {
            return new ResponseEntity<>("User Already Exist", HttpStatus.CONFLICT);
        }
        GroupMembers saveMember = GroupMembers.builder()
                .group(group).user(user).role(groupMemberDTO.getRole()).build();
        groupMemberRepository.save(saveMember);
        return ResponseEntity.ok("Memeber Added Successfully");

    }
}
