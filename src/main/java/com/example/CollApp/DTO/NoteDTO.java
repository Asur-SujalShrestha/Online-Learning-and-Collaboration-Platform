package com.example.CollApp.DTO;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteDTO {
    private String title;
    private String note;
    private Date date;
    private long userId;
}
