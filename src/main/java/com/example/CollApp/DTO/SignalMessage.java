package com.example.CollApp.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {
    private String type; // "offer", "answer", "ice-candidate", etc.
    private String roomId;
    private long userId;
    private String targetUserId; // For direct messages
    private Object data;
}

