package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class SubmittedAssignments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "AssignmentId")
    private Assignments assignments;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "UserId")
    private Users user;

    @Column(nullable = true)
    private String review;
    @Column(nullable = true)
    private String Grade;
    @Column(nullable = true)
    private Date date;

    @OneToMany(mappedBy = "submittedAssignments", fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JsonManagedReference("submittedAssignmentFile")
    private List<SubmittedAssignmentFiles> submittedAssignmentFiles;
}
