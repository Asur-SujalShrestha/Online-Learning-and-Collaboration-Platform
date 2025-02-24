import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import AssignmentForm from './AssignmentForm';
import SubmitAssignmentForm from './SubmitAssignmentForm';
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { jwtDecode } from 'jwt-decode';

function Assignment({ assignmentDetail, programDetail, onNewAssignment }) {
    const [showForm, setShowForm] = useState(false);
    const [userId, setUserId] = useState(null);
    const [programId, setProgramId] = useState(null);
    const [assignmentRefresh, setAssignmentRefresh] = useState(false);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState(null);

    useEffect(() => {
        getDecodedToken();
        if (programDetail) {
            setProgramId(programDetail.id);
        }
    }, [assignmentDetail, programDetail, assignmentRefresh]);

    const getDecodedToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        } else {
            console.log('No token found in localStorage');
        }
    };

    const handleSubmitClick = (assignmentId, assignmentTitle) => {
        setSelectedAssignmentId(assignmentId);
        setSelectedAssignmentTitle(assignmentTitle);
        setShowSubmitForm(true);
    };

    return (
        <div className="chat-section">
            <div className="chat-header">
                <div className='avatar-title'>
                    <img
                        src={programDetail?.members?.[0]?.user.profilePic !== "null" &&
                            programDetail?.members?.[0]?.user.profilePic !== "none"
                            ? programDetail?.members?.[0]?.user.profilePic
                            : ""}
                        alt="Profile"
                        className="profile-pic"
                    />
                    <h2>{programDetail?.name || "Loading..."}</h2>
                </div>
                <div className='call-list'>
                    <IoCall className='call' />
                    <FaVideo className='call' />
                    <HiDotsVertical className='call' />
                </div>
            </div>

            <div className="assignments-container">
                {assignmentDetail?.length > 0 ? (
                    <div className="assignments-list">
                        {assignmentDetail.map((assignment, index) => (
                            <div key={index} className="assignment-card">
                                <div className="assignment-header">
                                    <h3 style={{ margin: "0 0 20px 0" }}>{assignment.title}</h3>
                                    <div>
                                        <span className="publish-date">📅 Publish at: {new Date(assignment.uploadedDate).toLocaleDateString()}</span>
                                        <span className="due-date">📆 Due date: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p className="assignment-description">{assignment.description}</p>
                                <div className='assignment-file'>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        {assignment.assignmentFiles.length > 0 ? (
                                            assignment.assignmentFiles.map((file, index) => {
                                                const fileName = file.fileUrl.split('/').pop();
                                                return (
                                                    <div key={index} className="attachment">
                                                        <a style={{ color: "black", textDecoration: "none" }} href={file.fileUrl} download target="_blank" rel="noopener noreferrer">
                                                            {fileName}
                                                        </a>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="attachment">No attachments</div>
                                        )}
                                    </div>
                                    <button className="submit-btn" onClick={() => handleSubmitClick(assignment.id, assignment.title)}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No assignments available.</p>
                )}

                <button onClick={() => setShowForm(true)} className="add-assignment-btn">
                    Add Assignments <FaPlus className='chat-icon' />
                </button>

                {showForm && <AssignmentForm onClose={() => setShowForm(false)} id={programId} userId={userId} onNewAssignment={onNewAssignment} />}
                {showSubmitForm && <SubmitAssignmentForm assignmentId={selectedAssignmentId} selectedAssignmentTitle={selectedAssignmentTitle} programId={programId} userId={userId} onClose={() => setShowSubmitForm(false)} />}
            </div>
        </div>
    );
}

export default Assignment;
