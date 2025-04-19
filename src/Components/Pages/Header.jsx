import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../CSS/Header.css";
import { MdGroups } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AiFillMessage } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { MdStickyNote2 } from "react-icons/md";
import axios from "axios";

function Header() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded["Full Name"] || decoded.Email);
        setProfilePic(decoded.profilePic);
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

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (keyword.trim().length < 3) {
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
    navigate(`/profile/${email}`); // Adjust this path based on your app routing
  };

  const navigateProgram = () => navigate("/program");
  const navigateNotes = () => navigate("/note");
  const navigateChat = () => navigate("/chat");

  return (
    <div>
      <div className="nav-header">
        <h1 className="logos"><Link className="logo-title" to="/home">CollApp</Link></h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="nav-search-input"
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
                    <img src={user.profilePic} alt="pic" className="search-user-pic" />
                    <span style={{color:"#000"}}>{user.firstName} {user.lastName}</span>
                  </div>
                ))
              ) : (
                <div className="search-user-item">No users found</div>
              )}
            </div>
          )}
        </div>

        <div className="header-icons">
          <span className="icons"><AiFillMessage onClick={navigateChat} style={{ fontSize: "23px" }} /></span>
          <span className="icons"><MdGroups onClick={navigateProgram} style={{ fontSize: "26px" }} /></span>
          <span className="icons"><MdStickyNote2 onClick={navigateNotes} style={{ fontSize: "24px" }} /></span>
          <span className="icons"><IoMdNotifications style={{ fontSize: "24px" }} /></span>
          <Link className="logo-title" to="/login"><span className="profile">Hi, {userName || "Guest"}</span></Link>
          <div className="profile-avatar"><img src={profilePic} alt="" className="profilepic" /></div>
        </div>
      </div>
    </div>
  );
}

export default Header;
