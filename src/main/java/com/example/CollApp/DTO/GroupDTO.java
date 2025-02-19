package com.example.CollApp.DTO;

import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Programs;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupDTO {
    private long id;
    private String name;
    private List<GroupMemberDetailDTO> members;

    public GroupDTO(Groups groups) {
        this.id = groups.getId();
        this.name = groups.getName();
        this.members = groups.getMembers().stream()
                .map(GroupMemberDetailDTO::new)
                .collect(Collectors.toList());
    }
}
