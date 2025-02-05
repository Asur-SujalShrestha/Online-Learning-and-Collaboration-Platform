package com.example.CollApp.Service.Interface;

import com.example.CollApp.DTO.ChangeUserPassword;
import com.example.CollApp.DTO.MailBody;
import com.example.CollApp.Model.ForgetPassword;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ForgetPasswordRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.Implementation.IEmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailService implements IEmailService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final ForgetPasswordRepository forgetPasswordRepository;
    private final PasswordEncoder passwordEncoder;

    public EmailService(JavaMailSender mailSender, UserRepository userRepository, ForgetPasswordRepository forgetPasswordRepository, PasswordEncoder passwordEncoder) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.forgetPasswordRepository = forgetPasswordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<String> verifyMail(String email){
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Please use valid Email.");
        }
        int otp = otpGenerator();
        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("This is the OPT for your request " + otp)
                .subject("OTP for Forget Password request")
                .build();
        ForgetPassword forgetPasswordBuild = ForgetPassword.builder()
                .otpCode(otp)
                .expiryDate(new Date(System.currentTimeMillis()+ 60 *1000))
                .users(user)
                .build();
        sendSimpleMessage(mailBody);
        forgetPasswordRepository.save(forgetPasswordBuild);
        user.setForgetPassword(forgetPasswordBuild);
        userRepository.save(user);
        return ResponseEntity.ok("Email sent for Verification " + email);
    }

    private Integer otpGenerator(){
        Random rand = new Random();
        return rand.nextInt(100000,999999);
    }

    @Override
    public void sendSimpleMessage(MailBody mailBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("asur0825om@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());

        mailSender.send(message);
    }

    @Transactional
    public ResponseEntity<String> varifyOtp(int otp, String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Please use a valid Email.");
        }

        ForgetPassword forgetPassword = user.getForgetPassword();

        if (forgetPassword == null || forgetPassword.getOtpCode() != otp) {
            return new ResponseEntity<>("Invalid OTP", HttpStatus.BAD_REQUEST);
        }

        if (forgetPassword.getExpiryDate().before(Date.from(Instant.now()))) {
            user.setForgetPassword(null); // Remove reference
            userRepository.save(user);    // Save user to trigger orphan removal
            return new ResponseEntity<>("OTP has Expired. Please request another OTP.", HttpStatus.EXPECTATION_FAILED);
        }

        user.setForgetPassword(null); // Remove reference
        userRepository.save(user);    // Save user to trigger orphan removal

        return ResponseEntity.ok("OTP verified");
    }



    public ResponseEntity<String> changePassword(ChangeUserPassword changeUserPassword, String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Please use valid Email.");
        }
        String hashedPassword = passwordEncoder.encode(changeUserPassword.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Password changed successfully");
    }
}
