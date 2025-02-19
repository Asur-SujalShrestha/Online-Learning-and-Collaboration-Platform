package com.example.CollApp.Repository;

import com.example.CollApp.Model.GroupMembers;
import com.example.CollApp.Model.Groups;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMembers, Long> {
    Optional<GroupMembers> findByGroupAndUser(Groups group, Users user);
}
