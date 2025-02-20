package com.example.CollApp.Controller;

import com.example.CollApp.DTO.AssignmenDTO;
import com.example.CollApp.Model.Assignments;
import com.example.CollApp.Service.Interface.Implementation.AssignmentService;
import org.hibernate.sql.ast.tree.update.Assignment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/collapp/assignment")
public class AssignmentController {
    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    //http://localhost:8081/collapp/assignment/add-assignment
    @PostMapping("/add-assignment")
    public ResponseEntity<String> addNewAssignment(@RequestPart("AssignmentDetail") AssignmenDTO assignmenDTO, @RequestParam("files") List<MultipartFile> files) throws IOException {
        return assignmentService.addNewAssignment(assignmenDTO, files);
    }

    @DeleteMapping("/delete-assignment/{assignmentId}")
    public ResponseEntity<String> deleteAssignment(@PathVariable long assignmentId) {
        return assignmentService.deleteAssignment(assignmentId);
    }

    @GetMapping("/get-all-assignment")
    public ResponseEntity<List<Assignments>> getAllAssignment() {
        return assignmentService.getAllAssignment();
    }

    @GetMapping("/get-assignment/{programId}")
    public ResponseEntity<List<Assignments>> getAssignment(@PathVariable long programId) {
        return assignmentService.getAssignment(programId);
    }
}
