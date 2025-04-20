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
import AddGroupModal from "./AddGroupModal";
import Modal from "react-modal"; // install it: npm install react-modal


const ChatList = () => {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;
    const organizationId = token ? jwtDecode(token).organization : null;
    const [activeTab, setActiveTab] = useState("users");
    const [userList, setUserList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    // const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);



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
            // Step 1: Create group
            const groupRes = await axios.post(
                `${import.meta.env.VITE_API_GROUP}/register/new-group`,
                {
                    name: newGroupName,
                    organizationId: organizationId
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const groupId = groupRes.data || groupRes.data;

            // Step 2: Add members
            const memberRequests = selectedUsers.map(uid =>
                axios.post(
                    `${import.meta.env.VITE_API_GROUPMEMBER}/add-member`,
                    { groupId, userId: uid, role: "member" },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            );

            // Add current user as admin
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

                                    {activeTab === "groups" && (
                                        <>
                                            {/* Add Group Button */}
                                            <div className="group-header">
                                                <button className="add-group-btn" onClick={openGroupModal}>+ New Group</button>
                                            </div>

                                            {/* Modal for creating group */}
                                            <Modal isOpen={isGroupModalOpen} onRequestClose={closeGroupModal} className="group-modal">
                                                <h2>Create New Group</h2>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Group Name"
                                                    value={newGroupName}
                                                    onChange={(e) => setNewGroupName(e.target.value)}
                                                />
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
                                                <br />
                                                <button onClick={handleCreateGroup}>Create Group</button>
                                                <button onClick={closeGroupModal}>Cancel</button>
                                            </Modal>

                                            {/* Group List */}
                                            {groupList.map((group) => (
                                                <div key={group.id} className="chat-item" onClick={() => setSelectedGroup(group)}>
                                                    <div className="chat-avatar group-avatar">G</div>
                                                    <div className="chat-info">
                                                        <h4 className="chat-name">{capitalizeFirstLetter(group.name)}</h4>
                                                        <p className="chat-message">{group.members.length} Members</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="right-section">
                        <RightAside />
                    </div>
                </div>
            </div>

            {/* {showAddGroupModal && (
                <AddGroupModal
                    onClose={() => setShowAddGroupModal(false)}
                    onGroupCreated={fetchGroups}
                />
            )} */}

        </div>
    );
};

export default ChatList;
