package com.example.CollApp.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
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
