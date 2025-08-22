package com.example.CollApp.DTO;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeacherContentDTO {
    private String title;
    private long uploadedBy;
    private long programId;
}
