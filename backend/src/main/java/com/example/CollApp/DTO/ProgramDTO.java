package com.example.CollApp.DTO;

import com.example.CollApp.Model.Programs;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ProgramDTO {
    private long id;
    private String name;
    private List<ProgramMemberDetailDTO> members;

    public ProgramDTO(Programs program) {
        this.id = program.getId();
        this.name = program.getName();
        this.members = program.getMembers() != null ? program.getMembers().stream()
                .map(ProgramMemberDetailDTO::new)
                .collect(Collectors.toList()) : new ArrayList<>();
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<ProgramMemberDetailDTO> getMembers() {
        return members;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMembers(List<ProgramMemberDetailDTO> members) {
        this.members = members;
    }
}
