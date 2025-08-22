import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import "../CSS/SubmittedAssignment.css";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

function SubmittedAssignment({ programId , programDetail}) {
    const [assignments, setAssignments] = useState([]);
    useEffect(() => {
        const fetchSubmittedAssignment = async () => {
            const URL = `${import.meta.env.VITE_API_SUBMITTED_ASSIGNMENT}/program/${programId}`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.length > 0) {
                    setAssignments(response.data);
                } 
            } catch (error) {
                toast.error(error.response?.data || "An error occurred");
            }
        };

        fetchSubmittedAssignment();
    }, [programId]);
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
                    <h2 style={{color:"white"}}>{programDetail?.name || "Loading..."}</h2>
                </div>

                <div className='call-list'>
                    <IoCall className='call' />
                    <FaVideo className='call' />
                    <HiDotsVertical className='call' />
                </div>
            </div>
            <div className="submitted-container">
                <h2 className="submitted-heading">Submitted Assignments</h2>
                {assignments.map((submission, index) => (
                    <div key={index} className="assignment-card">
                        <div className="assignment-header">
                            <h3 style={{ margin: "0 0 20px 0" }}>{submission.assignments.title}</h3>
                            <div>
                                <span className="publish-date">📅 Publish at: {new Date(submission.assignments.uploadedDate).toLocaleDateString()}</span>
                                <span className="due-date">📆 Due date: {new Date(submission.assignments.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p className="assignment-description">{`Submitted By: ${submission.user.firstName} ${submission.user.lastName}`}</p>
                        <p className="assignment-description">{submission.assignments.description}</p>
                        <div className='assignment-file'>
                            <div style={{ display: "flex", gap: "20px" }}>
                                {submission.assignments.assignmentFiles.length > 0 ? (
                                    submission.assignments.assignmentFiles.map((file, index) => {
                                        // Extract file name from URL
                                        const fileName = file.fileUrl.split('/').pop();
                                        return (
                                            <div key={index} className="attachment">

                                                <a style={{ color: "black", textDecoration: "none" }} href={file.fileUrl} download={file.fileUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="attachment">No attachments</div>
                                )}
                            </div>
                            <p className="submitted">Submitted...</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubmittedAssignment
