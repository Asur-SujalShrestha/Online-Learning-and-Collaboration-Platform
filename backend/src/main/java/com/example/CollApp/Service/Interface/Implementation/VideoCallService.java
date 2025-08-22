package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.Model.Users;
import com.example.CollApp.Model.VideoCall;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Repository.VideoCallRepository;
import org.hibernate.annotations.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VideoCallService {

    @Autowired
    private VideoCallRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public VideoCall createRoom(String name) {
        VideoCall room = VideoCall.builder()
                .roomId(UUID.randomUUID().toString())
                .name(name)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        return roomRepository.save(room);
    }

    @Transactional
    public boolean joinRoom(String roomId, long userId) {
        VideoCall room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        // Check if the user is already a participant
        if (room.getParticipants().contains(user)) {
            throw new RuntimeException("User is already in the room");
        }

        // Add user to the video call participants
        room.getParticipants().add(user);
        user.getJoinedRooms().add(room); // Ensure bidirectional consistency

        roomRepository.save(room); // Only saving room is enough if cascade is properly set
        System.out.println("User " + userId + " successfully joined room " + roomId);
        return true;
    }



    @Transactional
    public boolean leaveRoom(String roomId, long userId) {
        VideoCall room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.getParticipants().removeIf(user -> user.getId().equals(userId));

        if (room.getParticipants().isEmpty()) {
            room.setActive(false);
        }

        roomRepository.save(room);
        return true;
    }

    @Transactional
    public void deleteRoom(String roomId) {
        VideoCall room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        roomRepository.delete(room);
    }
}
