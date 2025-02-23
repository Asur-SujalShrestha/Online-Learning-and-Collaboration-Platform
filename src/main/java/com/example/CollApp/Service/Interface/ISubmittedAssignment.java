package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.SubmittedAssignmentDTO;
import com.example.CollApp.Model.SubmittedAssignments;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ISubmittedAssignment {
    ResponseEntity<String> addSubmittedAssignment(SubmittedAssignmentDTO submittedAssignmentDTO, List<MultipartFile> file) throws IOException;

    ResponseEntity<List<SubmittedAssignments>> getSubmittedAssignment(long assignmentId);
}
