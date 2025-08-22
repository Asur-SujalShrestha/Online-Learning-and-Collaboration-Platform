package com.example.CollApp.Model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Conference {
    @Id
    private String id;            // unique conference ID (could be UUID or short code)
    private String title;
    private String hostUser;      // username of creator/host
    @ElementCollection
    private List<String> participants = new ArrayList<>();
    // getters and setters...
}
