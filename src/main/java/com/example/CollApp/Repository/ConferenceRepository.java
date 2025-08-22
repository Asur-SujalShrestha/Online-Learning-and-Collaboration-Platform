package com.example.CollApp.Repository;

import com.example.CollApp.Model.Conference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConferenceRepository extends JpaRepository<Conference, String> {
}
