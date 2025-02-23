import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import AssignmentForm from './AssignmentForm';

function Assignment({ assignmentDetail }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="assignments-container">

            {assignmentDetail?.length > 0 ? (<div className="assignments-list">
                {assignmentDetail.map((assignment, index) => (
                    <div key={index} className="assignment-card">
                        <div className="assignment-header">
                            <h3 style={{ margin: "0 0 20px 0" }}>{assignment.title}</h3>
                            <div>
                                <span className="publish-date">📅 Publish at: {assignment.uploadedDate}</span>
                                <span className="due-date">📆 Due date: {assignment.dueDate}</span>
                            </div>
                        </div>
                        <p className="assignment-description">{assignment.description}</p>
                        <div className='assignment-file'>
                            <div style={{display:"flex", gap:"20px"}}>
                            {assignment.assignmentFiles.length > 0 ? (
                                assignment.assignmentFiles.map((file, index) => {
                                    // Extract file name from URL
                                    const fileName = file.fileUrl.split('/').pop();
                                    return (
                                        <div key={index} className="attachment">
                                            
                                                <a style={{color:"black", textDecoration:"none"}} href={file.fileUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>
                                            
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="attachment">No attachments</div>
                            )}
                            </div>
                            <button className="submit-btn">Submit</button>
                        </div>

                    </div>
                ))}
            </div>) : (
                <p>No assignments available.</p>
            )}

            <button onClick={() => setShowForm(true)} className="add-assignment-btn">Add Assignments <FaPlus className='chat-icon' /></button>
            {showForm && <AssignmentForm onClose={() => setShowForm(false)} />}


        </div>
    )
}

export default Assignment
