import React, { useEffect, useState } from "react";
import "../CSS/ChatList.css";
import { FaSearch, FaPlus, FaChevronLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsThreeDotsVertical, BsCheck2All } from "react-icons/bs";
import Header from "./Header";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Chats from "./Chats";
import GroupChats from "./GroupChats";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

const ChatList = () => {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;
    const organizationId = token ? jwtDecode(token).organization : null;
    const [activeTab, setActiveTab] = useState("users");
    const [userList, setUserList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    const openGroupModal = () => setIsGroupModalOpen(true);
    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        setNewGroupName("");
        setSelectedUsers([]);
    };

    const handleCreateGroup = async () => {
        if (!newGroupName || selectedUsers.length === 0) {
            toast.error("Please provide a group name and select members.");
            return;
        }

        try {
            const groupRes = await axios.post(
                `${import.meta.env.VITE_API_GROUP}/register/new-group`,
                {
                    name: newGroupName,
                    organizationId: organizationId
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const groupId = groupRes.data || groupRes.data;

            const memberRequests = selectedUsers.map(uid =>
                axios.post(
                    `${import.meta.env.VITE_API_GROUPMEMBER}/add-member`,
                    { groupId, userId: uid, role: "member" },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );

            memberRequests.push(
                axios.post(
                    `${import.meta.env.VITE_API_GROUPMEMBER}/add-member`,
                    { groupId, userId: userId, role: "admin" },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );

            await Promise.all(memberRequests);
            toast.success("Group created successfully!");
            closeGroupModal();
            fetchGroups();
        } catch (err) {
            toast.error(err.response?.data || "Failed to create group");
        }
    };

    const filteredUsers = userList.filter(user => 
        user.id !== userId && 
        (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    const filteredGroups = groupList.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="app-container">
            <div className="header-section">
                <Header />
            </div>

            <div className="main-content">
                
                    <LeftAside />
                

                <AnimatePresence mode="wait">
                    {selectedUser ? (
                        <motion.div
                            key="chats"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="center-section"
                        >
                            <Chats 
                                receiver={selectedUser} 
                                onBack={() => setSelectedUser(null)} 
                            />
                        </motion.div>
                    ) : selectedGroup ? (
                        <motion.div
                            key="group-chats"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="center-section"
                        >
                            <GroupChats 
                                group={selectedGroup} 
                                onBack={() => setSelectedGroup(null)} 
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="center-section"
                        >
                            <div className="chat-container">
                                

                                <div className="chat-tabs">
                                    <button
                                        className={activeTab === "users" ? "active" : ""}
                                        onClick={() => { setActiveTab("users"); setSearchQuery(""); }}
                                    >
                                        Contacts
                                    </button>
                                    <button
                                        className={activeTab === "groups" ? "active" : ""}
                                        onClick={() => { setActiveTab("groups"); setSearchQuery(""); }}
                                    >
                                        Groups
                                    </button>
                                </div>

                                <div className="chat-list-container">
                                    {activeTab === "users" && (
                                        <>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <motion.div 
                                                        key={user.id} 
                                                        className="chat-item"
                                                        onClick={() => setSelectedUser(user)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="avatar-container">
                                                            <img 
                                                                src={user.profilePic !== "null" ? user.profilePic : "/default-avatar.png"} 
                                                                alt={user.firstName} 
                                                                className="chat-avatar" 
                                                            />
                                                            <span className={`status-dot ${Math.random() > 0.5 ? 'online' : 'offline'}`}></span>
                                                        </div>
                                                        <div className="chat-info">
                                                            <h4 className="chat-name">
                                                                {capitalizeFirstLetter(user.firstName) + " " + capitalizeFirstLetter(user.lastName)}
                                                            </h4>
                                                            <p className="chat-message">{user.email}</p>
                                                        </div>
                                                        <div className="chat-time">
                                                            <BsCheck2All className="read-icon" />
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="empty-state">
                                                    <p>No contacts found</p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {activeTab === "groups" && (
                                        <>
                                            <div className="group-header">
                                                <motion.button 
                                                    className="add-group-btn"
                                                    onClick={openGroupModal}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaPlus /> Create Group
                                                </motion.button>
                                            </div>

                                            <Modal 
                                                isOpen={isGroupModalOpen} 
                                                onRequestClose={closeGroupModal} 
                                                className="group-modal"
                                                overlayClassName="modal-overlay"
                                            >
                                                <h2>Create New Group</h2>
                                                <div className="form-group">
                                                    <label>Group Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Group Name"
                                                        value={newGroupName}
                                                        onChange={(e) => setNewGroupName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Select Members</label>
                                                    <select
                                                        multiple
                                                        value={selectedUsers}
                                                        onChange={(e) =>
                                                            setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))
                                                        }
                                                    >
                                                        {userList
                                                            .filter(user => user.id !== userId)
                                                            .map(user => (
                                                                <option key={user.id} value={user.id}>
                                                                    {user.firstName} {user.lastName}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="modal-actions">
                                                    <motion.button 
                                                        className="cancel-btn"
                                                        onClick={closeGroupModal}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                    <motion.button 
                                                        className="create-btn"
                                                        onClick={handleCreateGroup}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Create Group
                                                    </motion.button>
                                                </div>
                                            </Modal>

                                            {filteredGroups.length > 0 ? (
                                                filteredGroups.map((group) => (
                                                    <motion.div 
                                                        key={group.id} 
                                                        className="chat-item group-item"
                                                        onClick={() => setSelectedGroup(group)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="group-avatar">
                                                            {group.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="chat-info">
                                                            <h4 className="chat-name">
                                                                {capitalizeFirstLetter(group.name)}
                                                            </h4>
                                                            <p className="chat-message">
                                                                {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
                                                            </p>
                                                        </div>
                                                        <div className="chat-time">
                                                            <BsThreeDotsVertical />
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="empty-state">
                                                    <p>No groups found</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                    <RightAside />
            </div>
        </div>
    );
};

export default ChatList;