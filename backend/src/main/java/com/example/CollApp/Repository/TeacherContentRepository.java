package com.example.CollApp.Repository;

import com.example.CollApp.Model.Programs;
import com.example.CollApp.Model.TeacherContents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherContentRepository extends JpaRepository<TeacherContents, Long> {
    List<TeacherContents> findByPrograms(Programs programs);
}
