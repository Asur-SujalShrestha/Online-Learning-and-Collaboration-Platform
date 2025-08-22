package com.example.CollApp.Service;

import com.example.CollApp.Model.Planning;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.PlanningRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.PlanningService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PlanningServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PlanningRepository planningRepository;

    @InjectMocks private PlanningService planningService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserPlan_Success() {
        Users user = new Users(); user.setId(1L);
        List<Planning> plans = List.of(new Planning(), new Planning());

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(planningRepository.findByUsers(user)).thenReturn(plans);

        ResponseEntity<List<Planning>> response = planningService.getUserPlan(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());

        System.out.println("🧠 User plans found: " + response.getBody().size());
    }

    @Test
    void testGetUserPlan_UserNotFound() {
        when(userRepository.findById(404L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> planningService.getUserPlan(404L));

        assertEquals("User not found", ex.getMessage());
        System.out.println("❌ Get plan failed: " + ex.getMessage());
    }

    @Test
    void testDeletePlan_Success() {
        Planning plan = new Planning(); plan.setId(10L);
        when(planningRepository.findById(10L)).thenReturn(Optional.of(plan));

        ResponseEntity<String> response = planningService.deletePlan(10L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Plan deleted", response.getBody());

        System.out.println("🗑️ Delete plan response: " + response.getBody());
    }

    @Test
    void testDeletePlan_NotFound() {
        when(planningRepository.findById(55L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> planningService.deletePlan(55L));

        assertEquals("Plan not found", ex.getMessage());
        System.out.println("❌ Delete plan failed: " + ex.getMessage());
    }
}
