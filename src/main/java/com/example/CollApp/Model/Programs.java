package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Programs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("program-members")
    private List<ProgramMembers> members;

    public Programs() {
    }

    public List<ProgramMembers> getMembers() {
        return members;
    }

    public void setMembers(List<ProgramMembers> members) {
        this.members = members;
    }

    public Programs(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
