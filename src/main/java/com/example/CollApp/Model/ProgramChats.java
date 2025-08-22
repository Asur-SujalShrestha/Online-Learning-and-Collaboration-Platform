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
public class ProgramChats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JoinColumn(name = "sender", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Users sender;

    @JoinColumn(name = "program_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Programs program;

    private String message;
    private LocalDateTime timestamp;
}
