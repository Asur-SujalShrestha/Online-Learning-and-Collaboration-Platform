package com.example.CollApp.Repository;

import com.example.CollApp.Model.Assignments;
import com.example.CollApp.Model.Programs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignments, Long> {
    List<Assignments> findByProgram(Programs program);
}
