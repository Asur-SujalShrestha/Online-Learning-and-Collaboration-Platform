package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ChatDTO;
import com.example.CollApp.DTO.GroupChatDTO;
import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.GroupChats;
import com.example.CollApp.Model.ProgramChats;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Service.Interface.Implementation.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload ChatDTO chatDTO) {
        Users receiver = chatService.saveChat(chatDTO);
        messagingTemplate.convertAndSendToUser(
                 receiver.getId().toString(), // Unique user destination
                "/queue/messages",
                chatDTO
        );
    }

    @MessageMapping("/group-message")
    public void sendGroupMessage(@Payload GroupChatDTO groupChatDTO) {
        chatService.saveGroupChat(groupChatDTO);
        String destination = "/topic/group/" + groupChatDTO.getGroupId();
        System.out.println("📢 Broadcasting to group: " + destination);

        messagingTemplate.convertAndSend(destination, groupChatDTO);
    }

    @MessageMapping("/program-message")
    public void sendProgramMessage(@Payload GroupChatDTO groupChatDTO) {
        chatService.saveProgramChat(groupChatDTO);
        String destination = "/program/" + groupChatDTO.getGroupId();
        messagingTemplate.convertAndSend(destination, groupChatDTO);
    }

    @GetMapping("/collapp/get-program-messages/{programId}")
    public ResponseEntity<List<ProgramChats>> getProgramMessages(@PathVariable long programId) {
        return new ResponseEntity<>(chatService.getProgramMessages(programId), HttpStatus.OK);
    }

    @GetMapping("/collapp/get-group-messages/{groupId}")
    public ResponseEntity<List<GroupChats>> getGroupMessages(@PathVariable long groupId) {
        return new ResponseEntity<>(chatService.getGroupMessages(groupId), HttpStatus.OK);
    }


    //http://localhost:8081/collapp/get-messages
    @GetMapping("/collapp/get-messages")
    public ResponseEntity<List<Chats>> getMessages(@RequestParam long senderId, @RequestParam long receiverId) {
        return new ResponseEntity<>(chatService.getMessage(senderId, receiverId), HttpStatus.OK);
    }

    @PostMapping("/collapp/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return chatService.uploadImage(file);
    }
}
