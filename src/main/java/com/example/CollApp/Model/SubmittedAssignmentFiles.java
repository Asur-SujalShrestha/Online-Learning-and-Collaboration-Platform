package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubmittedAssignmentFiles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String fileUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submittedAssignmentId", nullable = false)
    @JsonBackReference("submittedAssignmentFile")
    private SubmittedAssignments submittedAssignments;
}
