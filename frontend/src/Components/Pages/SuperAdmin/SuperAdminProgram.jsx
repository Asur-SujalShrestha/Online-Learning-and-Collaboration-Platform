import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/Admin/Programs.css";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const SuperAdminPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [newProgramName, setNewProgramName] = useState("");
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programDetails, setProgramDetails] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("member");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);


    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const organizationId = token ? jwtDecode(token).organization : null;

    useEffect(() => {
        fetchPrograms();
        fetchAllUsers();
    }, [organizationId]);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_PROGRAM}/getPrograms`);
            setPrograms(response.data);
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_USER}/all-user`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchProgramDetails = async (programId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_PROGRAM}/getPrograms/${programId}`);
            setProgramDetails(response.data[0]);
        } catch (error) {
            console.error("Error fetching program details:", error);
        }
    };

    const handleAddProgram = async (e) => {
        e.preventDefault();
        if (!newProgramName.trim()) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_PROGRAM}/addProgram`, {
                name: newProgramName,
                organizationId: organizationId
            });
            toast.success(response.data);
            setNewProgramName("");
            fetchPrograms();
        } catch (error) {
            toast.error(error.response.data);
        }
    };

    const handleDeleteProgram = async (programId) => {
        setProgramToDelete(programId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_PROGRAM}/deleteProgram/${programToDelete}`);
            toast.success("Program deleted");
            fetchPrograms();
            setProgramDetails(null);
        } catch (error) {
            toast.error("Error deleting program");
        } finally {
            setShowConfirmModal(false);
            setProgramToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setProgramToDelete(null);
    };


    const handleAddMember = async () => {
        if (!selectedUser || !selectedRole) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_PROGRAM_MEMBER}/add-member`, {
                userId: selectedUser,
                programId: selectedProgram,
                role: selectedRole
            });
            toast.success(response.data);
            fetchProgramDetails(selectedProgram);
        } catch (error) {
            toast.error("Failed to add member");
        }
    };

    return (
        <div className="programs-container">
            <div className="page-header">
                <h2>Programs Management</h2>
                <form className="add-program-form" onSubmit={handleAddProgram}>
                    <input
                        type="text"
                        placeholder="Enter new program name"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                    />
                    <button type="submit">Add Program</button>
                </form>
            </div>

            <div className="program-list">
                {programs.map((program) => (
                    <div
                        className="program-card clickable"
                        key={program.id}
                        onClick={() => {
                            setSelectedProgram(program.id);
                            fetchProgramDetails(program.id);
                        }}
                    >
                        <div className="program-header">
                            <div className="program-name">{program.name}</div>
                            <button
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProgram(program.id);
                                    setShowConfirmModal(true);

                                }}
                            >
                                <MdDelete />
                            </button>
                        </div>
                        <div className="members">
                            {program.members.length === 0 ? (
                                <p className="no-members">No members</p>
                            ) : (
                                <p className="no-members">{program.members.length} Members</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {programDetails && (
                <div className="program-detail">
                    <button className="assignment-back-button" onClick={() => {
                        setProgramDetails(null);
                        setSelectedProgram(null);
                    }}>← Back to Programs</button>

                    <h3>{programDetails.name} - Members</h3>

                    <div className="member-list">
                        {programDetails.members.map((member) => (
                            <div className="member" key={member.id}>
                                <img src={member.user.profilePic} className="profile-pic" alt="" />
                                <div className="member-info">
                                    <span className="member-name">{member.user.firstName} {member.user.lastName}</span>
                                    <span className="member-role">{member.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="add-member-card">
                        <h4>Add Member</h4>
                        <div className="add-member-form">
                            <div className="program-form-group">
                                <label>User</label>
                                <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="program-form-group">
                                <label>Role</label>
                                <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
                                    <option value="member">Member</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <button className="add-btn" onClick={handleAddMember}>Add</button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this program?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default SuperAdminPrograms;
