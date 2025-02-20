package com.example.CollApp.Repository;

import com.example.CollApp.Model.AssignmentFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentFileRepository extends JpaRepository<AssignmentFiles, Long> {
}
