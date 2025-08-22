package com.example.CollApp.Model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WebRTCMessage {
    private String type;
    private String sender;
    private String receiver;
    private Object data;
}
