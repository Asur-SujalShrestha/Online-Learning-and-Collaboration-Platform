package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.ChatDTO;
import com.example.CollApp.DTO.GroupChatDTO;
import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.GroupChats;
import com.example.CollApp.Model.ProgramChats;
import com.example.CollApp.Model.Users;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IChatService {
    Users saveChat(ChatDTO chatDTO);

    List<Chats> getMessage(long senderId, long receiverId);

    void saveGroupChat(GroupChatDTO groupChatDTO);

    List<GroupChats> getGroupMessages(long groupId);

    ResponseEntity<String> uploadImage(MultipartFile file);

    void saveProgramChat(GroupChatDTO groupChatDTO);

    List<ProgramChats> getProgramMessages(long programId);
}
