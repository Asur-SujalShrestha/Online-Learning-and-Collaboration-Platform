package com.example.CollApp.Repository;

import com.example.CollApp.Model.ProgramMembers;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgramMemberRepository extends JpaRepository<ProgramMembers, Long> {
    Optional<ProgramMembers> findByProgramAndUser(Programs program, Users user);

    ProgramMembers findByProgramId(long programId);

    List<ProgramMembers> findByProgram(Programs program);
}
