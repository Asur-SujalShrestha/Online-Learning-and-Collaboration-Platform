package com.example.CollApp.DTO;

import com.example.CollApp.Model.Planning;
import com.example.CollApp.Model.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanningDto {
    private String title;
    private String description;
    private long userId;
}
