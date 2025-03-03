import React, { useState } from "react";
import "../CSS/ChatList.css";
import { FaSearch } from "react-icons/fa"; // Search icon
import Header from "./Header";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";

const ChatList = () => {
    const [activeTab, setActiveTab] = useState("users"); // Tab switch state

    const users = [
        { id: 1, name: "Susan Williamson", status: "online", message: "Friendly music geek.", unread: 1, image: "https://randomuser.me/api/portraits/women/1.jpg" },
        { id: 2, name: "Henrietta Wagner", status: "online", message: "Travel lover.", unread: 2, image: "https://randomuser.me/api/portraits/women/2.jpg" },
        { id: 3, name: "Lydia Snyder", status: "offline", message: "Coffee expert.", unread: 0, image: "https://randomuser.me/api/portraits/women/3.jpg" },
        { id: 4, name: "Harold Herrera", status: "online", message: "Creator.", unread: 0, image: "https://randomuser.me/api/portraits/men/4.jpg" },
        { id: 5, name: "Richard Garrett", status: "offline", message: "Travel fanatic.", unread: 0, image: "https://randomuser.me/api/portraits/men/5.jpg" },
       
    ];

    const groups = [
        { id: 1, name: "React Devs", unread: 3, image: "https://via.placeholder.com/50" },
        { id: 2, name: "AI Enthusiasts", unread: 1, image: "https://via.placeholder.com/50" },
    ];

    return (
        <div>
            <div className='main-container'>
                <div className='header-section'>
                    <Header />
                </div>

                <div className='container'>
                    <div className='left-section'>
                        <LeftAside />
                    </div>
                    <div className="profile-containers">
                        <div className="chat-container">


                            {/* Tabs */}
                            <div className="chat-tabs">
                                <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
                                    Users
                                </button>
                                <button className={activeTab === "groups" ? "active" : ""} onClick={() => setActiveTab("groups")}>
                                    Groups
                                </button>
                            </div>

                            {/* List Section */}
                            <div className="chat-list">
                                {(activeTab === "users" ? users : groups).map((item) => (
                                    <div key={item.id} className="chat-item">
                                        <img src={item.image} alt={item.name} className="chat-avatar" />
                                        <div className="chat-info">
                                            <h4 className="chat-name">{item.name}</h4>
                                            <p className="chat-message">{item.message || "New messages..."}</p>
                                        </div>
                                        {item.unread > 0 && <span className="chat-badge">{item.unread}</span>}
                                        {item.status && <span className={`status-dot ${item.status}`}></span>}
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                    <div className='right-section'>
                        <RightAside />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChatList;
