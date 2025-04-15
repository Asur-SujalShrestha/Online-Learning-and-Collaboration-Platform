package com.example.CollApp.Service.Interface;


import com.example.CollApp.DTO.InsertProgramDTO;
import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Programs;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IProgramService {
    ResponseEntity<String> addNewProgram(InsertProgramDTO program);

    ResponseEntity<String> deleteProgram(long programId);

    ResponseEntity<List<ProgramDTO>> getAllPrograms();

    ResponseEntity<List<ProgramDTO>> getProgramByUserId(long userId);

    ResponseEntity<List<ProgramDTO>> getProgramByProgramId(long userId);

    List<ProgramDTO> getProgramByOrganization(long organizationId);
}
