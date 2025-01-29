package com.example.CollApp.Service.Interface;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IAssignmentFileService {
    String uploadFile(MultipartFile file) throws IOException;
}
