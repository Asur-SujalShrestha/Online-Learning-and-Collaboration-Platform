package com.example.CollApp.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Users  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String email;
    private String address;
    @JsonIgnore
    private String password;
    private String role;
    private String profilePic;

    public ForgetPassword getForgetPassword() {
        return forgetPassword;
    }

    public void setForgetPassword(ForgetPassword forgetPassword) {
        this.forgetPassword = forgetPassword;
    }

    @OneToOne(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private ForgetPassword forgetPassword;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Posts> posts;

    @ManyToMany(mappedBy = "participants")
    private Set<VideoCall> joinedRooms = new HashSet<>();
}
