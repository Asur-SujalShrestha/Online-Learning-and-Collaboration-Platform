package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.GroupMemberDTO;
import org.springframework.http.ResponseEntity;

public interface IGroupMemberService {
    ResponseEntity<String> addMemeber(GroupMemberDTO groupMemberDTO);
}
