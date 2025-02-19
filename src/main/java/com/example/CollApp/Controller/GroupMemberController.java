package com.example.CollApp.Controller;

import com.example.CollApp.DTO.GroupMemberDTO;
import com.example.CollApp.Service.Interface.Implementation.GroupMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/collapp/group-member")
@CrossOrigin
public class GroupMemberController {
    private final GroupMemberService groupMemberService;

    public GroupMemberController(GroupMemberService groupMemberService) {
        this.groupMemberService = groupMemberService;
    }

    //http://localhost:8081/collapp/group-member/add-member
    @PostMapping("/add-member")
    public ResponseEntity<String> addNewMember(@RequestBody GroupMemberDTO groupMemberDTO) {
        return groupMemberService.addMemeber(groupMemberDTO);
    }
}
