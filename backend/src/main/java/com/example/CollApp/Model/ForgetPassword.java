package com.example.CollApp.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;


@Entity
public class ForgetPassword {
 public long getId() {
  return id;
 }

 @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

 public Date getExpiryDate() {
  return expiryDate;
 }

 public void setExpiryDate(Date expiryDate) {
  this.expiryDate = expiryDate;
 }

 public int getOtpCode() {
  return otpCode;
 }

 public void setOtpCode(int otpCode) {
  this.otpCode = otpCode;
 }

 @Column(nullable = false)
  private int otpCode;
  @Column(nullable = false)
  private Date expiryDate;

  @OneToOne
  private Users users;



  public ForgetPassword() {}

  public ForgetPassword(long id, int otpCode, Date expiryDate, Users users) {
   this.id = id;
   this.otpCode = otpCode;
   this.expiryDate = expiryDate;
   this.users = users;
  }

  public static ForgetPasswordBuilder builder() {
   return new ForgetPasswordBuilder();
  }

  public static class ForgetPasswordBuilder {
   private long id;
   private int otpCode;
   private Date expiryDate;
   private Users users;

   public ForgetPasswordBuilder id(long id) {
    this.id = id;
    return this;
   }

   public ForgetPasswordBuilder otpCode(int otpCode) {
    this.otpCode = otpCode;
    return this;
   }

   public ForgetPasswordBuilder expiryDate(Date expiryDate) {
    this.expiryDate = expiryDate;
    return this;
   }

   public ForgetPasswordBuilder users(Users users) {
    this.users = users;
    return this;
   }

   public ForgetPassword build() {
    return new ForgetPassword(id, otpCode, expiryDate, users);
   }
  }


}
