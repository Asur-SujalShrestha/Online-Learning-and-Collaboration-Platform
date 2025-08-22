package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.TeacherContentDTO;
import com.example.CollApp.Model.TeacherContentFiles;
import com.example.CollApp.Model.TeacherContents;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ITeacherContentService {
    ResponseEntity<String> addContent(TeacherContentDTO teacherContentDTO, List<MultipartFile> files);

    ResponseEntity<List<TeacherContentFiles>> getContent(long contentId);

    ResponseEntity<List<TeacherContents>> getContentByProgram(long programId);
}
