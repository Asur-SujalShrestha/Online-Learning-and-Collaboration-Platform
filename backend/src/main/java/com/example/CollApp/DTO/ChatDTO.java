package com.example.CollApp.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatDTO {
 private long senderId;
 private long receiverId;
 private String message;
 private String status;
}
