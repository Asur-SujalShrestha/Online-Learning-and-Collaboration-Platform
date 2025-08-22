import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdGroups, MdStickyNote2, MdClose, MdMenu } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Header.css";

function Header() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded["Full Name"] || decoded.Email);
        setProfilePic(decoded.profilePic || "");
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_USER}/all-user`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    // Mock notifications - replace with actual API call
    setNotifications([
      { id: 1, text: "You have a new message", read: false },
      { id: 2, text: "Your post got 5 likes", read: false },
      { id: 3, text: "Class reminder at 3pm", read: true }
    ]);

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (keyword.trim().length < 2) {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredUsers(filtered);
    setShowDropdown(true);
  };

  const navigateToUser = (email) => {
    setSearchTerm("");
    setShowDropdown(false);
    navigate(`/profile/${email}`);
    setIsMenuOpen(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    navigate("/notification")
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-left">
          <Link to="/home" className="logo-link">
            <h1 className="main-logo">CollApp</h1>
          </Link>
          
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for classmates..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => searchTerm && setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="search-dropdown">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="search-user-item"
                      onClick={() => navigateToUser(user.email)}
                    >
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="profile" className="search-user-pic" />
                      ) : (
                        <FaUserCircle className="search-user-pic default-pic" />
                      )}
                      <div className="search-user-info">
                        <span className="search-user-name">{user.firstName} {user.lastName}</span>
                        <span className="search-user-email">{user.email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">No users found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <div className="nav-icon" onClick={() => navigateTo("/chat")} title="Messages">
              <AiFillMessage />
              <span className="nav-tooltip">Messages</span>
            </div>
            <div className="nav-icon" onClick={() => navigateTo("/program")} title="Groups">
              <MdGroups />
              <span className="nav-tooltip">Groups</span>
            </div>
            <div className="nav-icon" onClick={() => navigateTo("/note")} title="Notes">
              <MdStickyNote2 />
              <span className="nav-tooltip">Notes</span>
            </div>
            <div className="nav-icon notification-icon" onClick={toggleNotifications} title="Notifications">
              <IoMdNotifications />
              {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
              <span className="nav-tooltip">Notifications</span>
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Notifications</h4>
                    <small>Mark all as read</small>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-dot"></div>
                        <p>{notification.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">No new notifications</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="user-profile" onClick={() => navigateTo("/profile")}>
              {profilePic ? (
                <img src={profilePic} alt="profile" className="profile-pic" />
              ) : (
                <FaUserCircle className="profile-pic default-pic" />
              )}
              <span className="username">Hi, {userName || "Guest"}</span>
            </div>
          </nav>
          
          <button className="hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;