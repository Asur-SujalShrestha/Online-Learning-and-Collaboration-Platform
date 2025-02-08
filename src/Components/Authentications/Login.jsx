import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import toast from 'react-hot-toast';

const Login = () => {
  const [step, setStep] = useState("login"); // Possible values: "login", "forgotPassword", "otpVerification"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   if (loading) {
  //     let progressInterval = setInterval(() => {
  //       setProgress((oldProgress) => (oldProgress >= 100 ? 0 : oldProgress + 5));
  //     }, 100);
  
  //     return () => clearInterval(progressInterval); // Clear interval on unmount
  //   } else {
  //     setProgress(0); // Reset progress when loading stops
  //   }
  // }, [loading]);
  
  const submitLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setProgress(20);
    const URL = `${import.meta.env.VITE_API_LOGIN}/users/login`;
    try {
      const response = await axios.post(URL, { email, password });
      setProgress(50);
      toast.success("Login Successful");
      console.log(response);
      localStorage.setItem("token", JSON.stringify(response.data.token));
      setProgress(100);
      setLoading(false);
      setProgress(0);
    } catch (error) {
      console.log("Login Failed");
      toast.error(error.response?.data ?? "Login Failed");
      setProgress(100);
      setLoading(false); 
      setProgress(0);
    }
  };

  const submitForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setProgress(20);
    const URL = `${import.meta.env.VITE_API_FORGET_PASSWORD}/verify-mail/${otpEmail}`;
    try {
      const response = await axios.post(URL);
      setProgress(50);
      console.log(response.data);
      toast.success("Verification email sent successfully!");
      setStep("otpVerification");
      setProgress(100);
      setLoading(false); 
      setProgress(0);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data ?? "Failed to send verification email");
      setLoading(false); 
      setProgress(0);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setProgress(20);
    try {
      const URL = `${import.meta.env.VITE_API_FORGET_PASSWORD}/verify-otp/${otpEmail}/${otpCode}`;
      const response = await axios.post(URL);
      setProgress(50);
      console.log(response.data);
      toast.success(response.data);
      setProgress(100);
      setStep("updatePassword");
      setLoading(false); 
      setProgress(0);
    }
    catch (error) {
      if (error.response.status === 417) {
        console.log(error);
        setOtpEmail("");
        setOtpCode("");
        setProgress(100);
        toast.error(error.response.data ?? "OTP Expired");
        setStep("forgotPassword");
        setLoading(false); 
        setProgress(0);
      }
      else if (error.response.status === 400) {
        console.log(error);
        setProgress(100);
        toast.error(error.response.data ?? "OTP Invalid");
        setLoading(false); 
        setProgress(0);
      }
      else {
        console.log(error);
        setProgress(100);
        toast.error(error.response.data ?? "Try Again");
        setLoading(false); 
        setProgress(0);
      }
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setProgress(20);
    const URL = `${import.meta.env.VITE_API_FORGET_PASSWORD}/change-password/${otpEmail}`;

    if (newPassword === newConfirmPassword) {
      try {
        setProgress(50);
        const response = await axios.post(URL, {
          password: newPassword,
          confirmPassword: newConfirmPassword
        });
        console.log(response.data);
        toast.success("Password updated successfully!");
        setProgress(100);
        setStep("login");
        setLoading(false); 
        setProgress(0);
      } catch (error) {
        console.log(error.response?.data);
        setProgress(100);
        toast.error(error.response?.data ?? "Password update failed.");
        setLoading(false); 
        setProgress(0);
      }
    } else {
      setProgress(100);
      toast.error("Password and Confirm Password should be the same.");
      setLoading(false); 
      setProgress(0);
    }
};


  return (
    <div className="login-page">
      <div className="top-loader" style={{ width: `${progress}%` }}></div>


      <div className="login-container">
        <div className="login-left">
          <img
            src="src/assets/images/login.png"
            alt="CollApp background"
            className="background-image"
          />
          <h1 className="app-title">CollApp</h1>
        </div>
        <div className="login-right">
          {step === "login" && (
            <>
              <h2 className="login-title">Sign in</h2>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="src/assets/images/loginPerson1.jpg" alt="login" style={{ width: "175px" }} />
              </div>
              <form onSubmit={submitLoginForm}>
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
                  <a href="#" onClick={() => setStep("forgotPassword")} className="forgot-password">
                    Forgot Password?
                  </a>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button type="submit" className="login-button">Login</button>
                </div>
              </form>
            </>
          )}

          {step === "forgotPassword" && (
            <>
              <h2 className="forgetPassword-title">Forgot Your Password</h2>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="src/assets/images/forgetPassword.jpg" alt="Forget Password" style={{ width: "300px" }} />
              </div>
              <form onSubmit={submitForgotPassword}>
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
                  <a href="#" onClick={() => setStep("login")} className="forgot-password">
                    Back to Login
                  </a>
                </div>
              </form>
            </>
          )}

          {step === "otpVerification" && (
            <>
              <h2 className="otp-title">OTP Verification</h2>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="src/assets/images/email_OTP.jpg" alt="OTP Verification" style={{ width: "250px" }} />
              </div>
              <form onSubmit={verifyOtp}>
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
                  <a href="#" onClick={() => setStep("forgotPassword")} className="forgot-password">
                    Back to Forget Password
                  </a>
                </div>
              </form>
            </>
          )}

          {step === "updatePassword" && (
            <>
              <h2 className="login-title">Update Password</h2>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="src\assets\images\updatePassword.jpg" alt="login" style={{ width: "175px" }} />
              </div>
              <form onSubmit={updatePassword}>
                <div className="form-group">
                  <label htmlFor="newPassword">Password:</label>
                  <input
                    type="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newConfirmPassowrd">Confirm Password:</label>
                  <input
                    type="newConfirmPassowrd"
                    id="newConfirmPassowrd"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    name="newConfirmPassowrd"
                    placeholder="Enter your password again"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button type="submit" className="login-button">Update</button>
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
