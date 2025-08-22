package com.example.CollApp.Controller;

import com.example.CollApp.Model.Conference;
import com.example.CollApp.Service.Interface.Implementation.ConferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/conferences")
@CrossOrigin
public class ConferenceController {

    @Autowired
    private ConferenceService conferenceService;

    // Create a new conference
    @PostMapping("/create-conference")
    public ResponseEntity<Conference> createConference(@RequestBody Map<String, String> payload,
                                                       Principal principal) {
        String title = payload.getOrDefault("title", "Untitled Conference");
        String username = principal.getName();  // authenticated user's username
        Conference conf = conferenceService.createConference(username, title);
        return ResponseEntity.ok(conf);
    }

    @GetMapping("/get-conference")
    public ResponseEntity<List<Conference>> getConferences() {
        return conferenceService.getAllConference();
    }

    // Join an existing conference
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinConference(@PathVariable String id, Principal principal) {
        String username = principal.getName();
        Conference conf = conferenceService.joinConference(id, username);
        // Prepare response with current participants (excluding self)
        Set<String> allParticipants = conferenceService.getParticipants(id);
        List<String> otherUsers = allParticipants.stream()
                .filter(u -> !u.equals(username))
                .toList();
        Map<String, Object> response = new HashMap<>();
        response.put("conferenceId", id);
        response.put("participants", otherUsers);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveConference(@PathVariable String id, Principal principal) {
        // Use the authenticated user's identity to remove them from the conference
        String username = principal.getName();
        conferenceService.leaveConference(id, username);
        return ResponseEntity.ok().build();
    }
}

