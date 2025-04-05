package com.example.CollApp.Repository;

import com.example.CollApp.Model.VideoCall;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoCallRepository extends JpaRepository<VideoCall, Long> {
    @EntityGraph(attributePaths = "participants")  // Ensures participants are loaded
    Optional<VideoCall> findByRoomId(String roomId);
}
