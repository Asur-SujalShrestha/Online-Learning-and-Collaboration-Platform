package com.example.CollApp.Repository;

import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Posts;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Posts, Long> {

    List<Posts> findByOrganizations(Organizations organization);

    List<Posts> findByUser(Users user);
}
