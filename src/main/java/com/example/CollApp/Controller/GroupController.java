package com.example.CollApp.Controller;

import com.example.CollApp.DTO.GroupDTO;
import com.example.CollApp.DTO.InsertGroupDTO;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Service.Interface.Implementation.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/group")
@CrossOrigin
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    //http://localhost:8081/collapp/group/register/new-group
    @PostMapping("/register/new-group")
    public ResponseEntity<Long> addNewGroup(@RequestBody InsertGroupDTO group) {
        return groupService.addNewGroup(group);
    }
    //http://localhost:8081/collapp/group/get-all-group
    @GetMapping("/get-all-group")
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        return groupService.getAllGroups();
    }

    @DeleteMapping("/delete/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable long groupId) {
        return groupService.deleteGroup(groupId);
    }

    @GetMapping("/get-group-organization/{organizationId}")
    public ResponseEntity<List<GroupDTO>> getGroupsByOrganization(@PathVariable long organizationId) {
        List<GroupDTO> groupList = groupService.getGroupByOrganization(organizationId);
        return ResponseEntity.ok(groupList);
    }
}
