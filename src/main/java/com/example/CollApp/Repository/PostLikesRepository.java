package com.example.CollApp.Repository;

import com.example.CollApp.Model.PostLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, Long> {
    @Query("SELECT pl FROM PostLikes pl WHERE pl.posts.id = :postId AND pl.users.id = :userId")
    Optional<PostLikes> findByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);


}
