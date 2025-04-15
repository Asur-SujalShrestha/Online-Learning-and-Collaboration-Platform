package com.example.CollApp.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    private String firstName;
    private String lastName;
    private String dob;
    private String email;
    private String address;
    private String password;
    private String role;
    private long organizationId;
    private String profilePic;
}
