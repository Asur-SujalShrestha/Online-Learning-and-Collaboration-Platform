package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.ProgramMemberDTO;
import com.example.CollApp.Model.ProgramMembers;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IProgramMemberService {
    ResponseEntity<String> addNewMember(ProgramMemberDTO programMemberDTO);

    ResponseEntity<List<ProgramMembers>> getMemberByProgram(long programId);
}
