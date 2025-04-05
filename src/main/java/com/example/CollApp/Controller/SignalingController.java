package com.example.CollApp.Controller;

import com.example.CollApp.Model.WebRTCMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SignalingController {

//    @MessageMapping("/signal")
//    @SendTo("/topic/signaling")
//    public WebRTCMessage handleSignaling(WebRTCMessage message) {
//        System.out.println("Received signal: " + message);
//        return message;
//    }
}

