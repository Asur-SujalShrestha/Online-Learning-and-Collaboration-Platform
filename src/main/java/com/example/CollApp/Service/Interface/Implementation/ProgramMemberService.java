package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.ProgramMemberDTO;
import com.example.CollApp.Model.ProgramMembers;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ProgramMemberRepository;
import com.example.CollApp.Repository.ProgramRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IProgramMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProgramMemberService implements IProgramMemberService {
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final ProgramMemberRepository programMemberRepository;

    public ProgramMemberService(UserRepository userRepository, ProgramRepository programRepository, ProgramMemberRepository programMemberRepository) {
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.programMemberRepository = programMemberRepository;
    }

    @Override
    public ResponseEntity<String> addNewMember(ProgramMemberDTO programMemberDTO) {
        Optional<Users> user = userRepository.findById(programMemberDTO.getUserId());
        if (user.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        Optional<Programs> programs = programRepository.findById(programMemberDTO.getProgramId());
        if (programs.isEmpty()) {
            return new ResponseEntity<>("Program not found", HttpStatus.NOT_FOUND);
        }
        ProgramMembers newMember = new ProgramMembers();
        newMember.setUser(user.orElse(null));
        newMember.setProgram(programs.orElse(null));
        newMember.setRole(programMemberDTO.getRole());
        programMemberRepository.save(newMember);
        return ResponseEntity.ok("Member added successfully");

    }
}
