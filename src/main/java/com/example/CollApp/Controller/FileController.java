package com.example.CollApp.Controller;

import com.example.CollApp.Service.Interface.Implementation.AssignmentFileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/collapp/file")
public class FileController {

    private final AssignmentFileService assignmentFileService;
    public FileController(AssignmentFileService assignmentFileService) {
        this.assignmentFileService = assignmentFileService;
    }

    // /collapp/file/assignment-file-upload
    @PostMapping("/assignment-file-upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        long maxFileSize = 8 * 1024 * 1024; // 8MB
        if (file.getSize() > maxFileSize) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("File size exceeds the maximum limit of 8MB.");
        }
        try {
            String url = assignmentFileService.uploadFile(file);
            return ResponseEntity.ok("File uploaded successfully: " + url);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
}
