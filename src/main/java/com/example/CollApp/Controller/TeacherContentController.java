package com.example.CollApp.Controller;

import com.example.CollApp.DTO.TeacherContentDTO;
import com.example.CollApp.Model.TeacherContentFiles;
import com.example.CollApp.Model.TeacherContents;
import com.example.CollApp.Service.Interface.Implementation.TeacherContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/collapp/teacher-content")
@CrossOrigin
public class TeacherContentController {
    private final TeacherContentService teacherContentService;

    public TeacherContentController(TeacherContentService teacherContentService) {
        this.teacherContentService = teacherContentService;
    }

    //http://localhost:8081/collapp/teacher-content/add-content
    @PostMapping("/add-content")
    public ResponseEntity<String> addTeacherContent(@RequestPart("teacherContent") TeacherContentDTO teacherContentDTO, @RequestParam("file") List<MultipartFile> files) {
        return teacherContentService.addContent(teacherContentDTO, files);
    }

    //http://localhost:8081/collapp/teacher-content/get-content/program/2
    @GetMapping("/get-content/program/{programId}")
    public ResponseEntity<List<TeacherContents>> getTeacherContentByProgramId(@PathVariable("programId") long programId) {
        return teacherContentService.getContentByProgram(programId);
    }
    //http://localhost:8081/collapp/teacher-content/get-content/1

    @GetMapping("/get-content/{contentId}")
    public ResponseEntity<List<TeacherContentFiles>> getTeacherContent(@PathVariable("contentId") long contentId) {
        return teacherContentService.getContent(contentId);
    }
}
