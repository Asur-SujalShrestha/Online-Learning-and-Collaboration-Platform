package com.example.CollApp.Repository;

import com.example.CollApp.Model.Programs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Programs, Long> {
}
