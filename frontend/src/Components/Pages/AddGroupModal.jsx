// components/AddGroupModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../CSS/AddGroupModal.css"
import { jwtDecode } from "jwt-decode";
const AddGroupModal = ({ onClose, onGroupCreated }) => {
    const [groupName, setGroupName] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;
    const organizationId = token ? jwtDecode(token).organization : null;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const URL = `${import.meta.env.VITE_API_USER}/all-user`;
        try {
            const response = await axios.get(URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(response.data.filter(u => u.id !== userId));
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    const handleSubmit = async () => {
        if (!groupName || selectedMembers.length === 0) {
            return toast.error("Group name and members required.");
        }

        // 1. Create group
        try {
            const createGroupURL = `${import.meta.env.VITE_API_GROUP}/register/new-group`;
            const groupRes = await axios.post(createGroupURL, {
                name: groupName,
                organizationId: organizationId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newGroupId = parseInt(groupRes.data?.[0]); // assuming the response includes group ID

            // 2. Add members
            const addMemberURL = `${import.meta.env.VITE_API_GROUPMEMBER}/add-member`;
            await Promise.all(selectedMembers.map(user => axios.post(addMemberURL, {
                groupId: newGroupId,
                userId: user.id,
                role: "Member"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })));

            toast.success("Group created successfully!");
            onGroupCreated(); // Refresh group list
            onClose();
        } catch (err) {
            toast.error("Group creation failed.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Create New Group</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <select multiple onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions);
                    setSelectedMembers(options.map(opt => JSON.parse(opt.value)));
                }}>
                    {allUsers.map(user => (
                        <option key={user.id} value={JSON.stringify(user)}>
                            {user.firstName} {user.lastName} ({user.email})
                        </option>
                    ))}
                </select>

                <button onClick={handleSubmit}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddGroupModal;
