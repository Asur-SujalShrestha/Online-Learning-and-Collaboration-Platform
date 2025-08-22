package com.example.CollApp.Repository;

import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<Users, Long> {
    public Users findByEmail(String email);

    List<Users> findByOrganization(Organizations organizations);

    Users findByEmailAndPassword(String email, String password);
}
