import React from 'react';
import "../CSS/Header.css"

function Header() {
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
                    <span className="profile">Hi, Name</span>
                    <div className="profile-avatar"></div>
                </div>
            </div>
    </div>
  )
}

export default Header
