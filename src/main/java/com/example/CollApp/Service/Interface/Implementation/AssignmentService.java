package com.example.CollApp.Service.Interface.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CollApp.DTO.AssignmenDTO;
import com.example.CollApp.Model.AssignmentFiles;
import com.example.CollApp.Model.Assignments;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.AssignmentFileRepository;
import com.example.CollApp.Repository.AssignmentRepository;
import com.example.CollApp.Repository.ProgramRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IAssignmentService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Primary
public class AssignmentService implements IAssignmentService {
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final AssignmentRepository assignmentRepository;
    private final Cloudinary cloudinary;
    private final AssignmentFileRepository assignmentFileRepository;

    public AssignmentService(UserRepository userRepository, ProgramRepository programRepository, AssignmentRepository assignmentRepository, @Qualifier("cloudinary") Cloudinary cloudinary, AssignmentFileRepository assignmentFileRepository) {
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.assignmentRepository = assignmentRepository;
        this.cloudinary = cloudinary;
        this.assignmentFileRepository = assignmentFileRepository;
    }
    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")); // "auto" detects file type
        return uploadResult.get("url").toString();
    }

    @Override
    public ResponseEntity<String> addNewAssignment(AssignmenDTO assignmenDTO, List<MultipartFile> files) throws IOException {
        Users user = userRepository.findById(assignmenDTO.getUserId()).get();
        Programs program = programRepository.findById(assignmenDTO.getProgramId()).get();
        if(user == null) {
            return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
        }
        if(program == null) {
            return new ResponseEntity<>("Program Not Found", HttpStatus.NOT_FOUND);
        }

        Assignments assignments = Assignments.builder()
                .title(assignmenDTO.getTitle())
                .description(assignmenDTO.getDescription())
                .uploadedDate(assignmenDTO.getUploadedDate())
                .dueDate(assignmenDTO.getDueDate())
                .user(user)
                .program(program)
                .build();
        assignmentRepository.save(assignments);
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                AssignmentFiles assignmentFiles = AssignmentFiles.builder().assignments(assignments)
                        .fileUrl(uploadFile(file)).build();
                assignmentFileRepository.save(assignmentFiles);
            }
        }
        return new ResponseEntity<>("Assignment Added", HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<String> deleteAssignment(long assignmentId) {
        Assignments assignments = assignmentRepository.findById(assignmentId).get();
        if(assignments == null) {
            return new ResponseEntity<>("Assignment Not Found", HttpStatus.NOT_FOUND);
        }
        assignmentRepository.delete(assignments);
        return new ResponseEntity<>("Assignment Deleted", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Assignments>> getAllAssignment() {
        return new ResponseEntity<>(assignmentRepository.findAll(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Assignments>> getAssignment(long programId) {
        Programs program = programRepository.findById(programId).get();
        return new ResponseEntity<>(assignmentRepository.findByProgram(program), HttpStatus.OK);
    }
}
