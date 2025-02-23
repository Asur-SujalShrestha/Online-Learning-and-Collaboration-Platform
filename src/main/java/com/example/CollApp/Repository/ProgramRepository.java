package com.example.CollApp.Repository;

import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Programs, Long> {
    @Query("SELECT p FROM Programs p JOIN p.members m WHERE m.user = :user")
    List<Programs> findByUser(@Param("user") Users user);
}
