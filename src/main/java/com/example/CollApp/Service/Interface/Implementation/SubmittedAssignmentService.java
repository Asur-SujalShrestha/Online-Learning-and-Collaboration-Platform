package com.example.CollApp.Service.Interface.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.SubmittedAssignmentDTO;
import com.example.CollApp.Model.Assignments;
import com.example.CollApp.Model.SubmittedAssignmentFiles;
import com.example.CollApp.Model.SubmittedAssignments;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.AssignmentRepository;
import com.example.CollApp.Repository.SubmittedAssignmentFileRepository;
import com.example.CollApp.Repository.SubmittedAssignmentRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.ISubmittedAssignment;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class SubmittedAssignmentService implements ISubmittedAssignment {
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final SubmittedAssignmentRepository submittedAssignmentRepository;
    private final Cloudinary cloudinary;
    private final SubmittedAssignmentFileRepository submittedAssignmentFileRepository;

    public SubmittedAssignmentService(AssignmentRepository assignmentRepository, UserRepository userRepository, SubmittedAssignmentRepository submittedAssignmentRepository, @Qualifier("cloudinary") Cloudinary cloudinary, SubmittedAssignmentFileRepository submittedAssignmentFileRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.submittedAssignmentRepository = submittedAssignmentRepository;
        this.cloudinary = cloudinary;
        this.submittedAssignmentFileRepository = submittedAssignmentFileRepository;
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

        // First, save the submittedAssignments object
        SubmittedAssignments submittedAssignments = SubmittedAssignments.builder()
                .assignments(assignments)
                .user(user)
                .Grade(null)
                .review(null)
                .date(submittedAssignmentDTO.getDate())
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
}
