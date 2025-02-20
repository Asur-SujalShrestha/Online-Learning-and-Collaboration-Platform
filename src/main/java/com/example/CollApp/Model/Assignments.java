package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Assignments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String description;
    private Date uploadedDate;
    private Date dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ProgramId", nullable = false)
    @JsonBackReference("program-assignment")
    private Programs program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_By", nullable = false)
    private Users user;

    @OneToMany(mappedBy = "assignments")
    @JsonManagedReference
    private List<AssignmentFiles> assignmentFiles;
}
