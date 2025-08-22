package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.Model.Conference;
import com.example.CollApp.Repository.ConferenceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ConferenceService {
    private final ConferenceRepository conferenceRepo;
    // In-memory map of active conference participants (for quick lookup)
    private final Map<String, Set<String>> activeConferences = new ConcurrentHashMap<>();

    public ConferenceService(ConferenceRepository conferenceRepo) {
        this.conferenceRepo = conferenceRepo;
    }

    public Conference createConference(String hostUsername, String title) {
        Conference conf = new Conference();
        conf.setId(UUID.randomUUID().toString());
        conf.setTitle(title);
        conf.setHostUser(hostUsername);
        conf.getParticipants().add(hostUsername);
        conferenceRepo.save(conf);
        activeConferences.put(conf.getId(), ConcurrentHashMap.newKeySet());
        activeConferences.get(conf.getId()).add(hostUsername);
        return conf;
    }

    public Conference joinConference(String conferenceId, String username) {
        Conference conf = conferenceRepo.findById(conferenceId)
                .orElseThrow(() -> new IllegalArgumentException("Conference not found"));
        // Add to persistence and in-memory set
        if (!conf.getParticipants().contains(username)) {
            conf.getParticipants().add(username);
            conferenceRepo.save(conf);
        }
        activeConferences.getOrDefault(conferenceId, ConcurrentHashMap.newKeySet())
                .add(username);
        return conf;
    }

    public Set<String> getParticipants(String conferenceId) {
        return activeConferences.getOrDefault(conferenceId, Collections.emptySet());
    }

    public void leaveConference(String conferenceId, String username) {
        // Find the conference (this could be a JPA repository or an in-memory store)
        Conference conf = conferenceRepo.findById(conferenceId)
                .orElseThrow(() -> new RuntimeException("Conference not found"));

        // Remove the user from the conference's participants list
        conf.getParticipants().removeIf(participant ->
                participant.equals(username));

        // Save the updated conference (if using JPA/Hibernate, this might not be strictly necessary
        // if the entity is managed, but it's clear to call save for updating the participants)
        conferenceRepo.save(conf);

        // If no participants remain, clean up the conference (optional)
        if (conf.getParticipants().isEmpty()) {
            conferenceRepo.delete(conf);
            // Alternatively, mark it as ended: conf.setActive(false); conferenceRepository.save(conf);
        }
    }


    public ResponseEntity<List<Conference>> getAllConference() {
        return new ResponseEntity<>(conferenceRepo.findAll(), HttpStatus.OK);
    }
}

