package com.example.CollApp.DTO;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationDTO {
    private String organizationName;
    private String address;
    private String phone;
    private String email;
    private String password;

    //Admin Detail
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String profilePic;
}
