package com.example.CollApp.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;



@Builder
public class ChangeUserPassword {
    private String Password;
    private String ConfirmPassword;

    public ChangeUserPassword() {
    }
    public ChangeUserPassword(String Password, String ConfirmPassword) {
        this.Password = Password;
        this.ConfirmPassword = ConfirmPassword;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getConfirmPassword() {
        return ConfirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        ConfirmPassword = confirmPassword;
    }
}
