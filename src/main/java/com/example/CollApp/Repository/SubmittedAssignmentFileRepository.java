package com.example.CollApp.Repository;

import com.example.CollApp.Model.SubmittedAssignmentFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmittedAssignmentFileRepository extends JpaRepository<SubmittedAssignmentFiles, Long> {
}
