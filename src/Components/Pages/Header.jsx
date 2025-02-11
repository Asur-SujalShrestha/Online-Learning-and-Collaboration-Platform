import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure this is imported
import "../CSS/Header.css";

function Header() {
  const [userName, setUserName] = useState("");

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

  return (
    <div>
      <div className="header">
        <h1 className="logo">CollApp</h1>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <div className="header-icons">
          <span className="icon">💬</span>
          <span className="icon">🔔</span>
          <span className="profile">Hi, {userName || "Guest"}</span>
          <div className="profile-avatar"></div>
        </div>
      </div>
    </div>
  );
}

export default Header;
