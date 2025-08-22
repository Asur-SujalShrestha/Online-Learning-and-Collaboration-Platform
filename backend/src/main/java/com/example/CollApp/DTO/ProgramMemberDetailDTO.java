package com.example.CollApp.DTO;

import com.example.CollApp.Model.ProgramMembers;

public class ProgramMemberDetailDTO {
    private Long id;
    private UserDTO user;
    private String role;

    public ProgramMemberDetailDTO(ProgramMembers member) {
        this.id = member.getId();
        this.user = new UserDTO(member.getUser()); // Excludes posts
        this.role = member.getRole();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
