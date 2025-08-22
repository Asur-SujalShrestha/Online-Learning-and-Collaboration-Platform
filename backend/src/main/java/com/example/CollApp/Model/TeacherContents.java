package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeacherContents {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "uploadedBy", nullable = false)
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "programId", nullable = false)
    @JsonIgnore
    private Programs programs;

    @OneToMany(mappedBy = "teacherContents", orphanRemoval = true)
    @JsonManagedReference("teacherContent")
    private List<TeacherContentFiles> files;
}
