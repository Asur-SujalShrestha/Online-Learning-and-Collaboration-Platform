package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.AssignmenDTO;
import com.example.CollApp.Model.Assignments;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IAssignmentService {
    ResponseEntity<String> addNewAssignment(AssignmenDTO assignmenDTO, List<MultipartFile> files) throws IOException;

    ResponseEntity<String> deleteAssignment(long assignmentId);

    ResponseEntity<List<Assignments>> getAllAssignment();

    ResponseEntity<List<Assignments>> getAssignment(long programId);
}
