package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.ChatDTO;
import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ChatRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IChatService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService implements IChatService {
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    public ChatService(UserRepository userRepository, ChatRepository chatRepository) {
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
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
                .build();
        chatRepository.save(chat);
        return receiver;
    }

    @Override
    public List<Chats> getMessage(long senderId, long receiverId) {
        Users sender = userRepository.findById(senderId).orElseThrow(()->new RuntimeException("Sender not found"));
        Users receiver = userRepository.findById(receiverId).orElseThrow(()->new RuntimeException("Receiver not found"));
        return chatRepository.findBySenderAndReceiver(sender, receiver);
    }
}
