package com.example.CollApp.Service.Interface;


import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Programs;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IProgramService {
    ResponseEntity<String> addNewProgram(Programs program);

    ResponseEntity<String> deleteProgram(long programId);

    ResponseEntity<List<ProgramDTO>> getAllPrograms();
}
