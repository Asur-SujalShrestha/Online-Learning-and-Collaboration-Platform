package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ProgramMemberDTO;
import com.example.CollApp.Service.Interface.Implementation.ProgramMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/collapp/program-member")
public class ProgramMemberController {
    private final ProgramMemberService programMemberService;

    public ProgramMemberController(ProgramMemberService programMemberService) {
        this.programMemberService = programMemberService;
    }

    //http://localhost:8081/collapp/program-member/add-member
    @PostMapping("/add-member")
    public ResponseEntity<String> addMember(@RequestBody ProgramMemberDTO programMemberDTO) {
        return programMemberService.addNewMember(programMemberDTO);
    }
}
