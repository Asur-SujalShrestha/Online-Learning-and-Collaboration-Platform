package com.example.CollApp.Repository;

import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Organizations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Groups, Long> {
    List<Groups> findByOrganization(Organizations organization);
}
