package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.TeacherContentDTO;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.TeacherContentFiles;
import com.example.CollApp.Model.TeacherContents;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ProgramRepository;
import com.example.CollApp.Repository.TeacherContentFileRepository;
import com.example.CollApp.Repository.TeacherContentRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.ITeacherContentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class TeacherContentService implements ITeacherContentService {
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final AssignmentFileService assignmentFileService;
    private final TeacherContentRepository teacherContentRepository;
    private final TeacherContentFileRepository teacherContentFileRepository;

    public TeacherContentService(UserRepository userRepository, ProgramRepository programRepository, AssignmentFileService assignmentFileService, TeacherContentRepository teacherContentRepository, TeacherContentFileRepository teacherContentFileRepository) {
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.assignmentFileService = assignmentFileService;
        this.teacherContentRepository = teacherContentRepository;
        this.teacherContentFileRepository = teacherContentFileRepository;
    }

    @Override
    public ResponseEntity<String> addContent(TeacherContentDTO teacherContentDTO, List<MultipartFile> files) {
        Users user = userRepository.findById(teacherContentDTO.getUploadedBy()).orElseThrow(()->new RuntimeException("User Not Found"));
        Programs program = programRepository.findById(teacherContentDTO.getProgramId()).orElseThrow(()->new RuntimeException("Program Not Found"));
        TeacherContents teacherContents = TeacherContents.builder()
                .title(teacherContentDTO.getTitle())
                .users(user)
                .programs(program)
                .build();
        teacherContentRepository.save(teacherContents);
        if(!files.isEmpty() && files != null){
            for(MultipartFile file : files){
                if(!file.isEmpty()){
                    try {
                        String fileName = assignmentFileService.uploadFile(file);
                        TeacherContentFiles teacherContentFiles = TeacherContentFiles.builder()
                                .teacherContents(teacherContents)
                                .fileUrl(fileName)
                                .build();
                        teacherContentFileRepository.save(teacherContentFiles);
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("File upload failed: " + e.getMessage());
                    }
                }
            }
        }
        return ResponseEntity.ok("Content added successfully");
    }

    @Override
    public ResponseEntity<List<TeacherContentFiles>> getContent(long contentId) {
        TeacherContents teacherContents = teacherContentRepository.findById(contentId).orElseThrow(()->new RuntimeException("Content Not Found"));
        return ResponseEntity.ok(teacherContentFileRepository.findByTeacherContents(teacherContents));
    }

    @Override
    public ResponseEntity<List<TeacherContents>> getContentByProgram(long programId) {
        Programs programs = programRepository.findById(programId).orElseThrow(()-> new RuntimeException("Program Not Found"));
        return ResponseEntity.ok(teacherContentRepository.findByPrograms(programs));
    }
}
