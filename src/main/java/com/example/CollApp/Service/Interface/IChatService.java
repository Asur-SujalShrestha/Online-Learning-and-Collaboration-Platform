package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.ChatDTO;
import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.Users;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IChatService {
    Users saveChat(ChatDTO chatDTO);

    List<Chats> getMessage(long senderId, long receiverId);

    ResponseEntity<String> uploadImage(MultipartFile file);
}
