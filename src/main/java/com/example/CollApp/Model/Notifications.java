package com.example.CollApp.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String description;
    private LocalDateTime date;
    @JoinColumn(name = "receiverId", nullable = true)
    @ManyToOne(fetch = FetchType.EAGER)
    private Users user;
}
