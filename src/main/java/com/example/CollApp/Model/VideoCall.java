package com.example.CollApp.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoCall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomId;

    private String name;
    private boolean isActive;
    private LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.EAGER) // Optimized participant storage
    @JoinTable(name = "video_call_participants",
            joinColumns = @JoinColumn(name = "video_call_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<Users> participants = new HashSet<>();
}

