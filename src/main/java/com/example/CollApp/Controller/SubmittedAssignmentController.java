package com.example.CollApp.Controller;

import com.example.CollApp.DTO.SubmittedAssignmentDTO;
import com.example.CollApp.Model.SubmittedAssignments;
import com.example.CollApp.Service.Interface.Implementation.SubmittedAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/collapp/submitted-assignment")
@CrossOrigin
public class SubmittedAssignmentController {
    private final SubmittedAssignmentService submittedAssignmentService;

    public SubmittedAssignmentController(SubmittedAssignmentService submittedAssignmentService) {
        this.submittedAssignmentService = submittedAssignmentService;
    }

    //http://localhost:8081/collapp/submitted-assignment/add-submitted-assignment
    @PostMapping("/add-submitted-assignment")
    public ResponseEntity<String> addSubmittedAssignment(@RequestPart("submittedAssignment")SubmittedAssignmentDTO submittedAssignmentDTO, @RequestParam("file") List<MultipartFile> file) throws IOException {
        return submittedAssignmentService.addSubmittedAssignment(submittedAssignmentDTO, file);
    }

    //http://localhost:8081/collapp/submitted-assignment/1
    @GetMapping("/{assignmentId}")
    public ResponseEntity<List<SubmittedAssignments>> getSubmittedAssignment(@PathVariable("assignmentId") long assignmentId) {
        return submittedAssignmentService.getSubmittedAssignment(assignmentId);
    }

    //http://localhost:8081/collapp/submitted-assignment/program/2
    @GetMapping("/program/{programId}")
    public ResponseEntity<List<SubmittedAssignments>> getSubmittedAssignmentByProgram(@PathVariable("programId") long programId) {
        return submittedAssignmentService.getSubmittedAssignmentByProgram(programId);
    }
}
