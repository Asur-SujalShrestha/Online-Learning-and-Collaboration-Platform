import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step
  const [otpCode, setOtpCode] = useState(""); // Store OTP code

  const submitForm = async (e) => {
    e.preventDefault();
    
    const URL= `${import.meta.env.VITE_API_LOGIN}/users/login`;
    try{
      const response = await axios.post(URL, user);
      toast.success("Login Successfull");
      console.log(response);
      localStorage.setItem("token", JSON.stringify(response.data.token))
    }
    catch(error){
      console.log("Login Failed");
      toast.error(error.response.data ?? "Login Failed")
    }
  };


  const submitOptEmail = async (e)=>{
    e.preventDefault();

    const URL= `${import.meta.env.VITE_API_FORGET_PASSWORD}/verify-mail/${otpEmail}`;

    try {
      const response = await axios.post(URL);
      console.log(response.data);
      toast.success("Verification email sent successfully!");
      setIsForgotPassword(false)
      setIsOtpSent(true); // Show OTP form
  
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data ?? "Failed to send verification email");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img
            src="src/assets/login.png"
            alt="CollApp background"
            className="background-image"
          />
          <h1 className="app-title">CollApp</h1>
        </div>
        <div className="login-right">
          {!isForgotPassword ? (
            !isOtpSent ? (
              // **Login Form**
              <>
                <h2 className="login-title">Sign in</h2>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <img src="src/assets/loginPerson1.jpg" alt="login" style={{width:"175px"}} />
                </div>
                <form onSubmit={submitForm}>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="form-options">
                    <div className="rememberDiv">
                      <input type="checkbox" name="remember-me" />
                      <label>Remember me</label>
                    </div>
                    <a href="#" onClick={() => setIsForgotPassword(true)} className="forgot-password">
                      Forget Password?
                    </a>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button type="submit" className="login-button">Login</button>
                  </div>
                </form>
              </>
            ) : (
              // **OTP Verification Form**
              <>
                <h2 className="otp-title">OTP Verification</h2>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <img src="src\assets\email_OTP.jpg" alt="OTP Verification" style={{width:"250px"}} />
                </div>
                <form>
                  <div className="otp-form-group">
                    <label htmlFor="otpCode">Enter the 6-digit OTP:</label>
                    <input
                      type="text"
                      id="otpCode"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      name="otpCode"
                      placeholder="Enter OTP"
                      maxLength={6}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button type="submit" className="forgetPassword-button">Verify OTP</button>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "31px" }}>
                  <a href="#" onClick={() => {setIsForgotPassword(true); setIsOtpSent(false)}} className="forgot-password">
                    Back to Forget Password
                  </a>
                </div>
                </form>
              </>
            )
          ) : (
            // **Forgot Password Form**
            <>
              <h2 className="forgetPassword-title">Forgot Your Password</h2>
              <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <img src="src/assets/forgetPassword.jpg" alt="Forget Password" style={{width:"300px"}} />
              </div>
              <form onSubmit={submitOptEmail}>
                <div className="forgetPassword-form-group">
                  <label htmlFor="otpEmail">Enter your registered email:</label>
                  <input
                    type="email"
                    id="otpEmail"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    name="otpEmail"
                    placeholder="Enter your email"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button type="submit" className="forgetPassword-button">Send OTP</button>
                </div>
                <div style={{ textAlign: "center", marginTop: "31px" }}>
                  <a href="#" onClick={() => setIsForgotPassword(false)} className="forgot-password">
                    Back to Login
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
