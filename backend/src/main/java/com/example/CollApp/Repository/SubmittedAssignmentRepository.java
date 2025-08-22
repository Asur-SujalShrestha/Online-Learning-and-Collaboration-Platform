package com.example.CollApp.Repository;

import com.example.CollApp.Model.Assignments;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.SubmittedAssignments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmittedAssignmentRepository extends JpaRepository<SubmittedAssignments, Long> {
    List<SubmittedAssignments> findByAssignments(Assignments assignments);

    List<SubmittedAssignments> findByProgram(Programs programs);
}
