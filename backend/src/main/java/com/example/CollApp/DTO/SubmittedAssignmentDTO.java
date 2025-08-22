package com.example.CollApp.DTO;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubmittedAssignmentDTO {
    private long assignmentId;
    private long userId;
    private String review;
    private String Grade;
    private Date uploadedDate;
    private String description;
    private long programId;
}
