package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ProgramDTO;
import com.example.CollApp.Model.Programs;
import com.example.CollApp.Service.Interface.Implementation.ProgramService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collapp/program")
@CrossOrigin
public class ProgramController {

    private final ProgramService programService;

    public ProgramController(ProgramService programService) {
        this.programService = programService;
    }

    //http://localhost:8081/collapp/program/addProgram
    @PostMapping("/addProgram")
    public ResponseEntity<String> addProgram(@RequestBody Programs program) {
        return programService.addNewProgram(program);

    }

    @DeleteMapping("/deleteProgram/{programId}")
    public ResponseEntity<String> deleteProgram(@PathVariable long programId) {
        return programService.deleteProgram(programId);
    }

    //http://localhost:8081/collapp/program/getPrograms
    @GetMapping("/getPrograms")
    public ResponseEntity<List<ProgramDTO>> getPrograms() {
        return programService.getAllPrograms();
    }
    //http://localhost:8081/collapp/program/getPrograms/7
    @GetMapping("/getPrograms-userId/{userId}")
    public ResponseEntity<List<ProgramDTO>> getProgram(@PathVariable long userId) {
        return programService.getProgramByUserId(userId);
    }

    //http://localhost:8081/collapp/program/getPrograms-programId/1
    @GetMapping("/getPrograms/{programId}")
    public ResponseEntity<List<ProgramDTO>> getProgramByProgramId(@PathVariable long programId) {
        return programService.getProgramByProgramId(programId);
    }
}
