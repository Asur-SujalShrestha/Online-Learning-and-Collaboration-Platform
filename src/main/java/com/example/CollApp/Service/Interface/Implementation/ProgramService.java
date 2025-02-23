package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ProgramRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgramService implements IProgramService {
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;

    public ProgramService(ProgramRepository programRepository, UserRepository userRepository) {
        this.programRepository = programRepository;
        this.userRepository = userRepository;
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

    @Override
    public ResponseEntity<List<ProgramDTO>> getProgramByUserId(long userId) {
        Users user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        List<ProgramDTO> programDTOS = programRepository.findByUser(user).stream()
                .map(ProgramDTO::new)
                        .collect(Collectors.toList());
        return ResponseEntity.ok(programDTOS);
    }

    @Override
    public ResponseEntity<List<ProgramDTO>> getProgramByProgramId(long programId) {
        List<ProgramDTO> programDTOs = programRepository.findById(programId).stream()
                .map(ProgramDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(programDTOs);
    }
}
