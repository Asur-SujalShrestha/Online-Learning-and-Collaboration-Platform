package com.example.CollApp.Repository;

import com.example.CollApp.Model.Chats;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chats, Long> {
    List<Chats> findBySenderAndReceiver(Users sender, Users receiver);
}
