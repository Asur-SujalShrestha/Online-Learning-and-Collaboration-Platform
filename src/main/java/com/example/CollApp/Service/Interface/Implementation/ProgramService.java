package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Repository.ProgramRepository;
import com.example.CollApp.Service.Interface.IProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgramService implements IProgramService {
    private final ProgramRepository programRepository;

    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    @Override
    public ResponseEntity<String> addNewProgram(Programs program) {
        programRepository.save(program);
        return ResponseEntity.ok("Program added");
    }

    @Override
    public ResponseEntity<String> deleteProgram(long programId) {
        Programs programs = programRepository.findById(programId).get();
        if (programs == null) {
            return ResponseEntity.status(404).body("Program not found");
        }
        programRepository.delete(programs);
        return ResponseEntity.ok("Program deleted");
    }

    @Override
    public ResponseEntity<List<ProgramDTO>> getAllPrograms() {
        List<ProgramDTO> programDTOs = programRepository.findAll().stream()
                .map(ProgramDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(programDTOs);
    }
}
