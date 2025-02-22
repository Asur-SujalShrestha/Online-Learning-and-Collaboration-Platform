import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this is imported
import "../CSS/Header.css";
import { MdGroups } from "react-icons/md";
import { Link, Links, useNavigate } from "react-router-dom";

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

  return (
    <div>
      <div className="header">
        <h1 className="logo"><Link className="logo-title" to="/home">CollApp</Link></h1>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <div className="header-icons">
          <span className="icons">💬</span>
          <span className="icons"><MdGroups onClick={navigateProgram} style={{fontSize:"24px"}}/></span>
          <span className="icons">🔔</span>
          <Link className="logo-title" to="/login"><span className="profile">Hi, {userName || "Guest"}</span></Link>
          <div className="profile-avatar"></div>
        </div>
      </div>
    </div>
  );
}

export default Header;
