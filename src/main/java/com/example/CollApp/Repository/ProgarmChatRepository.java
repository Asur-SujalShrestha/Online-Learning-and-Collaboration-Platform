package com.example.CollApp.Repository;

import com.example.CollApp.Model.ProgramChats;
import com.example.CollApp.Model.Programs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgarmChatRepository extends JpaRepository<ProgramChats, Long> {

    List<ProgramChats> findByProgramOrderByTimestampAsc(Programs program);
}
