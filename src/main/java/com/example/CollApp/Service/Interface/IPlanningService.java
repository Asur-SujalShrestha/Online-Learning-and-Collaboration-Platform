package com.example.CollApp.Service.Interface;

import com.example.CollApp.Model.Planning;
import org.springframework.http.ResponseEntity;

import java.util.List;
public interface IPlanningService {
    ResponseEntity<List<Planning>> getUserPlan(long userId);

    ResponseEntity<String> deletePlan(long planId);
}
