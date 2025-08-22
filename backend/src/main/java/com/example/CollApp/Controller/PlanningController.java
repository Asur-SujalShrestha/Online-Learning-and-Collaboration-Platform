package com.example.CollApp.Controller;

import com.example.CollApp.DTO.PlanningDto;
import com.example.CollApp.Model.Planning;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.PlanningRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.PlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/collapp/planning")
@CrossOrigin
public class PlanningController {

    @Autowired
    private PlanningRepository planningRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlanningService planningService;

    @GetMapping("/get-plans")
    public List<Planning> getAllTickets() {
        return planningRepository.findAll();
    }

    @GetMapping("/get-plan/{userId}")
    public ResponseEntity<List<Planning>> getPlanning(@PathVariable long userId) {
        return planningService.getUserPlan(userId);
    }

    @PostMapping("/add-plan")
    public Planning createTicket(@RequestBody PlanningDto planningDto) {
        Users user = userRepository.findById(planningDto.getUserId()).orElseThrow(()->new RuntimeException("User not Found"));
        Planning planning = Planning.builder()
                .users(user)
                .title(planningDto.getTitle())
                .description(planningDto.getDescription())
                .status(Planning.Status.TODO)
                .build();
        return planningRepository.save(planning);
    }

    @PutMapping("/{id}")
    public Planning updateTicketStatus(@PathVariable Long id, @RequestBody Planning updated) {
        Planning planning = planningRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        planning.setStatus(updated.getStatus());
        return planningRepository.save(planning);
    }

    @DeleteMapping("/delete-plan/{planId}")
    public ResponseEntity<String> deleteTicket(@PathVariable long planId) {
        return planningService.deletePlan(planId);
    }
}
