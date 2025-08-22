package com.example.CollApp.Repository;

import com.example.CollApp.Model.ForgetPassword;
import com.example.CollApp.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForgetPasswordRepository extends JpaRepository<ForgetPassword, Long> {
    @Query("select fp from ForgetPassword fp where fp.otpCode = ?2 and fp.users = ?1")
    Optional<ForgetPassword> findByEmailAndOtp(Users user, int otp);
}
