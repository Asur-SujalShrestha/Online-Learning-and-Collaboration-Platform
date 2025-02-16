package com.example.CollApp.Repository;

import com.example.CollApp.Model.ProgramMembers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramMemberRepository extends JpaRepository<ProgramMembers, Long> {
}
