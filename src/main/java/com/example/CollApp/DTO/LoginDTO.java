package com.example.CollApp.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class LoginDTO {
    private String email;
    private String password;
}
