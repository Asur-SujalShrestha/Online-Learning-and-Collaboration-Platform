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
    private String type;       // "offer", "answer", or "candidate"
    private String sender;     // username of sender (set by server)
    private String target;     // username of intended recipient (for offer/answer/candidate)
    private String sdp;        // SDP offer/answer content (if type is offer/answer)
    private String candidate;  // ICE candidate string (if type is candidate)
    private String sdpMid;     // (optional) ICE candidate sdpMid
    private Integer sdpMLineIndex; // (optional) ICE candidate sdpMLineIndex
    private String content;    // chat content (if type is "chat", though we handle chat separately)
    // + getters/setters
}

