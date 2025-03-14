import React, { useEffect, useState } from "react";
import "../CSS/ChatList.css";
import { FaSearch } from "react-icons/fa"; // Search icon
import Header from "./Header";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Chats from "./Chats"; // Import Chats component
import GroupChats from "./GroupChats"; // Import GroupChats component

const ChatList = () => {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;

    const [activeTab, setActiveTab] = useState("users");
    const [userList, setUserList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    const fetchUsers = async () => {
        const URL = `${import.meta.env.VITE_API_USER}/all-user`;
        try {
            const response = await axios.get(URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserList(response.data);
        } catch (error) {
            toast.error(error.response?.data || "Something went wrong...");
        }
    };

    const fetchGroups = async () => {
        const URL = `${import.meta.env.VITE_API_GROUPMEMBER}/get-group/${userId}`;
        try {
            const response = await axios.get(URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGroupList(response.data);
        } catch (error) {
            toast.error(error.response?.data || "Something went wrong");
        }
    };

    const capitalizeFirstLetter = (word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    return (
        <div>
            <div className="main-container">
                <div className="header-section">
                    <Header />
                </div>

                <div className="container">
                    <div className="left-section">
                        <LeftAside />
                    </div>

                    {/* If a user is selected, show Chats component */}
                    {selectedUser ? (
                        <Chats receiver={selectedUser} onBack={() => setSelectedUser(null)} />
                    ) : selectedGroup ? (
                        <GroupChats group={selectedGroup} onBack={() => setSelectedGroup(null)} />
                    ) : (
                        <div className="profile-containers">
                            <div className="chat-container">
                                {/* Tabs */}
                                <div className="chat-tabs">
                                    <button
                                        className={activeTab === "users" ? "active" : ""}
                                        onClick={() => { setActiveTab("users"); setSelectedUser(null); setSelectedGroup(null); }}
                                    >
                                        Users
                                    </button>
                                    <button
                                        className={activeTab === "groups" ? "active" : ""}
                                        onClick={() => { setActiveTab("groups"); setSelectedUser(null); setSelectedGroup(null); }}
                                    >
                                        Groups
                                    </button>
                                </div>

                                {/* List Section */}
                                <div className="chat-list">
                                    {activeTab === "users" &&
                                        userList
                                            .filter(user => user.id !== userId)
                                            .map((user) => (
                                                <div key={user.id} className="chat-item" onClick={() => setSelectedUser(user)}>
                                                    <img src={user.profilePic !== "null" ? user.profilePic : "/default-avatar.png"} alt={user.firstName} className="chat-avatar" />
                                                    <div className="chat-info">
                                                        <h4 className="chat-name">{capitalizeFirstLetter(user.firstName) + " " + capitalizeFirstLetter(user.lastName)}</h4>
                                                        <p className="chat-message">{user.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                    }

                                    {activeTab === "groups" &&
                                        groupList.map((group) => (
                                            <div key={group.id} className="chat-item" onClick={() => setSelectedGroup(group)}>
                                                <div className="chat-avatar group-avatar">G</div>
                                                <div className="chat-info">
                                                    <h4 className="chat-name">{capitalizeFirstLetter(group.name)}</h4>
                                                    <p className="chat-message">{group.members.length} Members</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="right-section">
                        <RightAside />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
