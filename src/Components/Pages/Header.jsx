import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this is imported
import "../CSS/Header.css";
import { MdGroups } from "react-icons/md";
import { Link, Links, useNavigate } from "react-router-dom";
import { AiFillMessage } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { MdStickyNote2 } from "react-icons/md";

function Header() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); 
        setUserName(decoded["Full Name"] || decoded.Email); // Use `sub` as a fallback
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const navigateProgram=()=>{
    navigate("/program");
  }

  const navigateNotes=()=>{
    navigate("/note");
  }

  const navigateChat=()=>{
    navigate("/chat");
  }

  return (
    <div>
      <div className="header">
        <h1 className="logo"><Link className="logo-title" to="/home">CollApp</Link></h1>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <div className="header-icons">
          <span className="icons"><AiFillMessage onClick={navigateChat} style={{fontSize:"23px"}}/></span>
          <span className="icons"><MdGroups onClick={navigateProgram} style={{fontSize:"26px"}}/></span>
          <span className="icons"><MdStickyNote2  onClick={navigateNotes} style={{fontSize:"24px"}}/></span>
          <span className="icons"><IoMdNotifications style={{fontSize:"24px"}}/></span>
          <Link className="logo-title" to="/login"><span className="profile">Hi, {userName || "Guest"}</span></Link>
          <div className="profile-avatar"></div>
        </div>
      </div>
    </div>
  );
}

export default Header;
