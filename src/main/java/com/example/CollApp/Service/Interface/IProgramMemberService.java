package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.ProgramMemberDTO;
import org.springframework.http.ResponseEntity;

public interface IProgramMemberService {
    ResponseEntity<String> addNewMember(ProgramMemberDTO programMemberDTO);
}
