package com.example.CollApp.Service.Interface.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.ChatDTO;
import com.example.CollApp.DTO.GroupChatDTO;
import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.GroupChats;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ChatRepository;
import com.example.CollApp.Repository.GroupChatRepository;
import com.example.CollApp.Repository.GroupRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IChatService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ChatService implements IChatService {
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;
    private final Cloudinary cloudinary;
    private final GroupRepository groupRepository;
    private final GroupChatRepository groupChatRepository;

    public ChatService(UserRepository userRepository, ChatRepository chatRepository, @Qualifier("cloudinary") Cloudinary cloudinary, GroupRepository groupRepository, GroupChatRepository groupChatRepository) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.cloudinary = cloudinary;
        this.groupRepository = groupRepository;
        this.groupChatRepository = groupChatRepository;
    }

    @Override
    public Users saveChat(ChatDTO chatDTO) {
        Users sender = userRepository.findById(chatDTO.getSenderId()).orElseThrow(()->new RuntimeException("User not found"));
        Users receiver = userRepository.findById(chatDTO.getReceiverId()).orElseThrow(()->new RuntimeException("User not found"));
        Chats chat = Chats.builder()
                .sender(sender)
                .receiver(receiver)
                .message(chatDTO.getMessage())
                .status(Chats.MessageType.valueOf(chatDTO.getStatus()))
                .timestamp(LocalDateTime.now())
                .build();
        chatRepository.save(chat);
        return receiver;
    }

    @Override
    public List<Chats> getMessage(long senderId, long receiverId) {
        Users sender = userRepository.findById(senderId).orElseThrow(()->new RuntimeException("Sender not found"));
        Users receiver = userRepository.findById(receiverId).orElseThrow(()->new RuntimeException("Receiver not found"));

        return chatRepository.findBySenderAndReceiverOrSenderAndReceiverOrderByTimestampAsc(sender, receiver, receiver, sender);
    }

    @Override
    public void saveGroupChat(GroupChatDTO groupChatDTO) {
        Users sender = userRepository.findById(groupChatDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        Groups group = groupRepository.findById(groupChatDTO.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupChats groupChat = GroupChats.builder()
                .sender(sender)
                .group(group)
                .message(groupChatDTO.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        groupChatRepository.save(groupChat);
    }
    @Override
    public List<GroupChats> getGroupMessages(long groupId) {
        Groups group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return groupChatRepository.findByGroupOrderByTimestampAsc(group);
    }

    @Override
    public ResponseEntity<String> uploadImage(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return ResponseEntity.ok(uploadResult.get("url").toString());
        }
        catch (Exception e){
            throw new RuntimeException("Image upload failed");
        }
    }
}
