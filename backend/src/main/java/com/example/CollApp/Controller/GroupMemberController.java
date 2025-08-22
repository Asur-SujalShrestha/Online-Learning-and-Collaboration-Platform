package com.example.CollApp.Controller;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.GroupMemberDTO;
import com.example.CollApp.Model.GroupMembers;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Service.Interface.Implementation.GroupMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    //http://localhost:8081/collapp/group-member/get-group/7
    @GetMapping("/get-group/{userId}")
    public ResponseEntity<List<Groups>> getGroupByUserId(@PathVariable long userId) {
        return groupMemberService.getGroupByUserId(userId);
    }
}
