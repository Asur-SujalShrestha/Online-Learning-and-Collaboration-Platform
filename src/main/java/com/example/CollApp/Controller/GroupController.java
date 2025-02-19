package com.example.CollApp.Controller;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Service.Interface.Implementation.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/group")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    //http://localhost:8081/collapp/group/register/new-group
    @PostMapping("/register/new-group")
    public ResponseEntity<String> addNewGroup(@RequestBody Groups group) {
        return groupService.addNewGroup(group);
    }

    @GetMapping("/get-all-group")
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        return groupService.getAllGroups();
    }

    @DeleteMapping("/delete/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable long groupId) {
        return groupService.deleteGroup(groupId);
    }
}
