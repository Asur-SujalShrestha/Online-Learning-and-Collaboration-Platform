package com.example.CollApp.Repository;

import com.example.CollApp.Model.GroupChats;
import com.example.CollApp.Model.Groups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChats, Long> {
    List<GroupChats> findByGroupOrderByTimestampAsc(Groups group);
}

