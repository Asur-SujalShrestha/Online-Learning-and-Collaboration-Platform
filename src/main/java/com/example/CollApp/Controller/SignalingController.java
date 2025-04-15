package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ChatMessage;
import com.example.CollApp.DTO.SignalMessage;
import com.example.CollApp.Model.WebRTCMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;

@Controller
@CrossOrigin
public class SignalingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Receive signaling messages from clients on /app/signal/{confId}
    @MessageMapping("/signal/{confId}")
    public void handleSignal(@DestinationVariable String confId, SignalMessage message, Principal principal) {
        try {
            String sender = principal.getName();
            message.setSender(sender);
            String messageType = message.getType();
            if (messageType.equals("offer") || messageType.equals("answer") || messageType.equals("candidate")) {
                // Forward WebRTC signaling to the target user (point-to-point)
                String targetUser = message.getTarget();
                // Send to the specific user's queue for this conference
                messagingTemplate.convertAndSendToUser(
                        targetUser, "/queue/conference/" + confId, message);
            } else if (messageType.equals("chat")) {
                // Broadcast chat messages to all subscribers of the conference chat topic
                ChatMessage chatMsg = new ChatMessage(sender, message.getContent());
                messagingTemplate.convertAndSend("/topic/conference/" + confId + "/chat", chatMsg);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}


