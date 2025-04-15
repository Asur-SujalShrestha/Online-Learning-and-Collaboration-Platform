package com.example.CollApp.Repository;

import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organizations, Long> {
    Organizations findByEmail(String email);

}
