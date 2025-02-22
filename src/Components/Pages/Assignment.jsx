import React from 'react'
import { FaPlus } from "react-icons/fa6";

function Assignment() {
    const assignments = [
        {
            title: "Assignments Title",
            publishDate: "2051-10-01",
            dueDate: "2051-10-05",
            description: "Write ten pages handwriting and solve all the exercises of trigonometry.",
            attachment: "Attachments title",
        },
        {
            title: "Assignments Title",
            publishDate: "2051-10-01",
            dueDate: "2051-10-05",
            description: "Write ten pages handwriting and solve all the exercises of trigonometry.",
            attachment: "Attachments title",
        },
        {
            title: "Assignments Title",
            publishDate: "2051-10-01",
            dueDate: "2051-10-05",
            description: "Write ten pages handwriting and solve all the exercises of trigonometry.",
            attachment: "Attachments title",
        },
        {
            title: "Assignments Title",
            publishDate: "2051-10-01",
            dueDate: "2051-10-05",
            description: "Write ten pages handwriting and solve all the exercises of trigonometry.",
            attachment: "Attachments title",
        },
        {
            title: "Assignments Title",
            publishDate: "2051-10-01",
            dueDate: "2051-10-05",
            description: "Write ten pages handwriting and solve all the exercises of trigonometry.",
            attachment: "Attachments title",
        }
    ];
    return (
            <div className="assignments-container">

                <div className="assignments-list">
                    {assignments.map((assignment, index) => (
                        <div key={index} className="assignment-card">
                            <div className="assignment-header">
                                <h3 style={{ margin: "0 0 20px 0" }}>{assignment.title}</h3>
                                <div>
                                    <span className="publish-date">📅 Publish at: {assignment.publishDate}</span>
                                    <span className="due-date">📆 Due date: {assignment.dueDate}</span>
                                </div>
                            </div>
                            <p className="assignment-description">{assignment.description}</p>
                            <div className='assignment-file'>
                                <div className="attachment">{assignment.attachment}</div>
                                <button className="submit-btn">Submit</button>
                            </div>

                        </div>
                    ))}
                </div>

                <button className="add-assignment-btn">Add Assignments <FaPlus className='chat-icon' /></button>
            </div>
    )
}

export default Assignment
