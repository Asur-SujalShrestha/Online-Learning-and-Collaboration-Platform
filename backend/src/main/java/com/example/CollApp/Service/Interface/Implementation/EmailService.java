package com.example.CollApp.Service.Interface.Implementation;

import com.example.CollApp.DTO.ChangeUserPassword;
import com.example.CollApp.DTO.MailBody;
import com.example.CollApp.Model.ForgetPassword;
import com.example.CollApp.Model.Organizations;
import com.example.CollApp.Model.Users;
import com.example.CollApp.Repository.ForgetPasswordRepository;
import com.example.CollApp.Repository.UserRepository;
import com.example.CollApp.Service.Interface.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
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

    public ResponseEntity<String> verifyMail(String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Please use valid Email.");
        }

        // Clear old OTP if any
        ForgetPassword forgetPassword = user.getForgetPassword();
        if (forgetPassword != null) {
            user.setForgetPassword(null);
            userRepository.save(user);
        }

        // Generate OTP
        int otp = otpGenerator();

        // Styled HTML content
        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #D35400;'>OTP Verification</h2>"
                + "<p>Dear User,</p>"
                + "<p>You have requested to reset your password. Please use the following OTP to proceed:</p>"
                + "<div style='font-size: 24px; font-weight: bold; color: #2C3E50; margin: 20px 0;'>" + otp + "</div>"
                + "<p>This OTP is valid for <strong>1 minute</strong>.</p>"
                + "<p>If you did not make this request, please ignore this email.</p>"
                + "<p>Best regards,<br/>CollApp Team</p>"
                + "</div>";

        // Create mail body
        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("OTP for Forget Password Request")
                .text(htmlContent)
                .isHtml(true)
                .build();

        // Create and link new OTP object
        ForgetPassword forgetPasswordBuild = ForgetPassword.builder()
                .otpCode(otp)
                .expiryDate(new Date(System.currentTimeMillis() + 60 * 1000)) // 1 min validity
                .users(user)
                .build();

        sendSimpleMessage(mailBody);
        forgetPasswordRepository.save(forgetPasswordBuild);
        user.setForgetPassword(forgetPasswordBuild);
        userRepository.save(user);

        return ResponseEntity.ok("Email sent for verification to " + email);
    }


    public void OrganizationRegistration(String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Please use valid Email.");
        }

        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #2E86C1;'>Organization Registration Received</h2>"
                + "<p>Dear User,</p>"
                + "<p>Your organization registration form has been <strong>submitted successfully</strong>.</p>"
                + "<p>Please wait while our admin reviews and approves your request. You will receive a notification once it's approved.</p>"
                + "<p style='margin-top: 20px;'>Thank you for registering with <strong>CollApp</strong>.</p>"
                + "<p>Best regards,<br/>CollApp Team</p>"
                + "</div>";

        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("CollApp Organization Registration")
                .text(htmlContent)
                .isHtml(true)
                .build();

        sendSimpleMessage(mailBody);
    }



    public void UserRegistration(String email, String organization, String password) {
        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #2E86C1;'>Welcome to " + organization + "!</h2>"
                + "<p>You have been added to <strong>" + organization + "</strong>.</p>"
                + "<p>Use the credentials below to login:</p>"
                + "<table style='margin: 10px 0;'><tr><td><strong>Email:</strong></td><td>" + email + "</td></tr>"
                + "<tr><td><strong>Password:</strong></td><td>" + password + "</td></tr></table>"
                + "<p style='margin-top: 20px;'>Please change your password after logging in.</p>"
                + "<p>Regards,<br/>CollApp Team</p>"
                + "</div>";

        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("Your CollApp Account")
                .text(htmlContent)
                .isHtml(true)
                .build();

        sendSimpleMessage(mailBody);
    }


    public void AcceptOrganization(Organizations organization, String status) {
        String htmlContent;

        if (status.equalsIgnoreCase("PENDING")) {
            // Suspended-style email
            htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                    + "<h2 style='color: #C0392B;'>Organization Status Update</h2>"
                    + "<p>We're sorry to inform you that your organization <strong>" + organization.getOrganizationName() + "</strong> has been <strong>suspended</strong>.</p>"
                    + "<p>Please contact the administrator if you believe this was a mistake or to inquire further.</p>"
                    + "<p>Regards,<br/>CollApp Team</p>"
                    + "</div>";
        } else {
            // Accepted-style email
            htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                    + "<h2 style='color: #2E86C1;'>Welcome to CollApp!</h2>"
                    + "<p>Your organization <strong>" + organization.getOrganizationName() + "</strong> has been <strong>" + status.toUpperCase() + "</strong>.</p>"
                    + "<p>You can now use your credentials to log into the application.</p>"
                    + "<p>Regards,<br/>CollApp Team</p>"
                    + "</div>";
        }

        MailBody mailBody = MailBody.builder()
                .to(organization.getEmail())
                .subject("Your CollApp Organization")
                .text(htmlContent)
                .isHtml(true)
                .build();

        sendSimpleMessage(mailBody);
    }



    private Integer otpGenerator(){
        Random rand = new Random();
        return rand.nextInt(100000,999999);
    }

    @Override
    public void sendSimpleMessage(MailBody mailBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(mailBody.to());
            helper.setFrom("asur0825om@gmail.com");
            helper.setSubject(mailBody.subject());

            // Set email body with HTML support
            helper.setText(mailBody.text(), mailBody.isHtml());

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
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

        System.out.println(email);
        System.out.println(changeUserPassword.getPassword());
        System.out.println(changeUserPassword.getConfirmPassword());
        String hashedPassword = passwordEncoder.encode(changeUserPassword.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Password changed successfully");
    }
}
