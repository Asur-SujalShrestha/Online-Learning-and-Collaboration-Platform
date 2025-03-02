package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ChatDTO;
import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Service.Interface.Implementation.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate brokerMessagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = brokerMessagingTemplate;
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(@RequestBody ChatDTO chatDTO) {
        Users receiver = chatService.saveChat(chatDTO);
        messagingTemplate.convertAndSendToUser(receiver.getFirstName() + receiver.getId(), "/private", chatDTO);
    }


    @GetMapping("/collapp/get-messages")
    public ResponseEntity<List<Chats>> getMessages(@RequestParam long senderId , @RequestParam long receiverId) {
        return new ResponseEntity<>(chatService.getMessage(senderId, receiverId), HttpStatus.OK);
    }
}
