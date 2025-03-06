package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.GroupMemberDTO;
import com.example.CollApp.Model.GroupMembers;
import com.example.CollApp.Model.Groups;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IGroupMemberService {
    ResponseEntity<String> addMemeber(GroupMemberDTO groupMemberDTO);

    ResponseEntity<List<Groups>> getGroupByUserId(long userId);
}
