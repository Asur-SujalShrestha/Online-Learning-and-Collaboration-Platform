package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.Model.Planning;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.PlanningRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IPlanningService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanningService implements IPlanningService {
    private final UserRepository userRepository;
    private final PlanningRepository planningRepository;

    public PlanningService(UserRepository userRepository, PlanningRepository planningRepository) {
        this.userRepository = userRepository;
        this.planningRepository = planningRepository;
    }

    @Override
    public ResponseEntity<List<Planning>> getUserPlan(long userId) {
        Users user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        return new ResponseEntity<>(planningRepository.findByUsers(user), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deletePlan(long planId) {
        Planning plan = planningRepository.findById(planId).orElseThrow(()->new RuntimeException("Plan not found"));
        planningRepository.delete(plan);
        return ResponseEntity.ok("Plan deleted");
    }
}
