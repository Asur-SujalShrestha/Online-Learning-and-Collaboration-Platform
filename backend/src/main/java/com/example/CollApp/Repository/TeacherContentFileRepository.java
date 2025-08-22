package com.example.CollApp.Repository;

import com.example.CollApp.Model.TeacherContentFiles;
import com.example.CollApp.Model.TeacherContents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherContentFileRepository extends JpaRepository<TeacherContentFiles, Long> {

    List<TeacherContentFiles> findByTeacherContents(TeacherContents teacherContents);
}
