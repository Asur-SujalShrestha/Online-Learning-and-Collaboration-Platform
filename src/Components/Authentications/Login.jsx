import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import toast from 'react-hot-toast';

const Login = () => {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  const user ={
    email : email,
    password : password
  }
  const submitForm=async(e)=>{
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
  }
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <img
            src="src\assets\login.png" // Replace with your image URL
            alt="CollApp background"
            className="background-image"
          />
          <h1 className="app-title">CollApp</h1>
        </div>
        <div className="login-right">
          <h2 className="login-title">Sign in</h2>
          <form onSubmit={submitForm}>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input type="email" id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} name="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password :</label>
              <div className="password-container">
                <input type="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} name="password" placeholder="Enter your password" />
              </div>
            </div>
            <div className="form-options">
              <div className="rememberDiv">
                <input type="checkbox" name="remember-me" />
                <label>
                 Remember me
              </label>
              </div>
              
              <a href="/" className="forgot-password">Forget Password?</a>
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
              <button type="submit" className="login-button">Login</button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
