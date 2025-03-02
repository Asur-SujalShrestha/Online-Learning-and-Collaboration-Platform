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
public class Chats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "senderId")
    private Users sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiverId")
    private Users receiver;

    private String message;
    private MessageType status;

    private LocalDateTime timestamp = LocalDateTime.now();

    public enum MessageType {
        JOIN, MESSAGE, LEAVE
    }
}
