package com.example.CollApp.DTO;

import com.example.CollApp.Model.GroupMembers;
import com.example.CollApp.Model.ProgramMembers;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GroupMemberDetailDTO {
    private Long id;
    private UserDTO user;
    private String role;

    public GroupMemberDetailDTO(GroupMembers member) {
        this.id = member.getId();
        this.user = new UserDTO(member.getUser()); // Excludes posts
        this.role = member.getRole();
    }
}
