package com.example.CollApp.Repository;

import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {
    public Users findByEmail(String email);
}
