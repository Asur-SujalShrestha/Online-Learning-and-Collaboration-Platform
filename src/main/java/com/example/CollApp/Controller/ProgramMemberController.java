package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ProgramMemberDTO;
import com.example.CollApp.Model.ProgramMembers;
import com.example.CollApp.Service.Interface.Implementation.ProgramMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/program-member")
@CrossOrigin
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

    //http://localhost:8081/collapp/program-member/get-member/1
    @GetMapping("/get-member/{programId}")
    public ResponseEntity<List<ProgramMembers>> getMember(@PathVariable long programId) {
        return programMemberService.getMemberByProgram(programId);
    }
}
