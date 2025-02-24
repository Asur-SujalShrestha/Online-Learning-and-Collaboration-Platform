package com.example.CollApp.Service.Interface.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.SubmittedAssignmentDTO;
import com.example.CollApp.Model.*;
import com.example.CollApp.Repository.*;
import com.example.CollApp.Service.Interface.ISubmittedAssignment;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class SubmittedAssignmentService implements ISubmittedAssignment {
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final SubmittedAssignmentRepository submittedAssignmentRepository;
    private final Cloudinary cloudinary;
    private final SubmittedAssignmentFileRepository submittedAssignmentFileRepository;
    private final ProgramRepository programRepository;

    public SubmittedAssignmentService(AssignmentRepository assignmentRepository, UserRepository userRepository, SubmittedAssignmentRepository submittedAssignmentRepository, @Qualifier("cloudinary") Cloudinary cloudinary, SubmittedAssignmentFileRepository submittedAssignmentFileRepository, ProgramRepository programRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.submittedAssignmentRepository = submittedAssignmentRepository;
        this.cloudinary = cloudinary;
        this.submittedAssignmentFileRepository = submittedAssignmentFileRepository;
        this.programRepository = programRepository;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")); // "auto" detects file type
        return uploadResult.get("url").toString();
    }

    @Override
    public ResponseEntity<String> addSubmittedAssignment(SubmittedAssignmentDTO submittedAssignmentDTO, List<MultipartFile> file) throws IOException {
        Assignments assignments = assignmentRepository.findById(submittedAssignmentDTO.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment Not Found"));
        Users user = userRepository.findById(submittedAssignmentDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        Programs programs = programRepository.findById(submittedAssignmentDTO.getProgramId()).orElseThrow(() -> new RuntimeException("Program Not Found"));

        if (submittedAssignmentDTO.getUploadedDate().compareTo(assignments.getDueDate()) > 0) {
            return new ResponseEntity<>("Submission Date Exceed", HttpStatus.BAD_REQUEST);
        }
        SubmittedAssignments submittedAssignments = SubmittedAssignments.builder()
                .assignments(assignments)
                .user(user)
                .Grade(null)
                .review(null)
                .date(submittedAssignmentDTO.getUploadedDate())
                .description(submittedAssignmentDTO.getDescription())
                .program(programs)
                .build();
        submittedAssignments = submittedAssignmentRepository.save(submittedAssignments); // Save to get ID

        // Check if files exist
        if (file != null && !file.isEmpty()) {
            for (MultipartFile multipartFile : file) {
                if (!multipartFile.isEmpty()) {
                    try {
                        String fileUrl = uploadFile(multipartFile);
                        SubmittedAssignmentFiles submittedAssignmentFiles = SubmittedAssignmentFiles.builder()
                                .submittedAssignments(submittedAssignments)
                                .fileUrl(fileUrl)
                                .build();
                        submittedAssignmentFileRepository.save(submittedAssignmentFiles);
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("File upload failed: " + e.getMessage());
                    }
                }
            }
        }

        return ResponseEntity.ok("File Submitted Successfully");
    }


    @Override
    public ResponseEntity<List<SubmittedAssignments>> getSubmittedAssignment(long assignmentId) {
        Assignments assignments = assignmentRepository.findById(assignmentId).orElseThrow(()->new RuntimeException("Assignment Not Found"));
        return new ResponseEntity(submittedAssignmentRepository.findByAssignments(assignments), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<SubmittedAssignments>> getSubmittedAssignmentByProgram(long programId) {
        Programs programs = programRepository.findById(programId).orElseThrow(()->new RuntimeException("Program not Found"));
        return new ResponseEntity<>(submittedAssignmentRepository.findByProgram(programs), HttpStatus.OK);
    }
}
