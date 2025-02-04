package com.example.CollApp.Controller;

import com.example.CollApp.DTO.ChangeUserPassword;
import com.example.CollApp.DTO.MailBody;
import com.example.CollApp.Model.ForgetPassword;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Objects;
import java.util.Random;

@RestController
@RequestMapping("/collapp/auth")
public class ForgetPasswordController {
    private final EmailService emailService;

    public ForgetPasswordController(UserRepository userRepository, EmailService emailService) {
        this.emailService = emailService;
    }

    //http://localhost:8081/collapp/auth/verify-mail/sujalshrestha519@gmail.com
    @PostMapping("/verify-mail/{email}")
    public ResponseEntity<String> forgetPassword(@PathVariable String email) {
        return this.emailService.verifyMail(email);
    }

    //http://localhost:8081/collapp/auth/verify-otp/sujalshrestha519@gmail.com/391983
    @PostMapping("/verify-otp/{email}/{otp}")
    public ResponseEntity<String> forgetPasswordOTP(@PathVariable String email, @PathVariable int otp) {
        return emailService.varifyOtp(otp, email);
    }

    @PostMapping("/change-password/{email}")
    public ResponseEntity<String> changePassword(@RequestBody ChangeUserPassword changeUserPassword, @PathVariable String email) {
        if(!Objects.equals(changeUserPassword.getPassword(), changeUserPassword.getConfirmPassword())){
            return new ResponseEntity<>("Please enter password Correctly.", HttpStatus.EXPECTATION_FAILED);
        }
        return emailService.changePassword(changeUserPassword, email);
    }

}
