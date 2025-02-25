import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import AssignmentForm from './AssignmentForm';
import SubmitAssignmentForm from './SubmitAssignmentForm';
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CiFolderOn } from "react-icons/ci";
import "../CSS/TeacherContent.css"
import { Link } from 'react-router-dom';
import TeacherContentDetail from './TeacherContentDetail';

function TeacherContents({ programId, programDetail }) {
    const [contentDetail, setContentDetail] = useState(null);
    const [step, setStep] = useState("1");
    const [contentId, setContentId] = useState(null);
    useEffect(() => {
        const fetchContent = async () => {
            const URL = `${import.meta.env.VITE_API_TEACHER_CONTENT}/get-content/program/${programId}`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setContentDetail(response.data);
            }
            catch (error) {
                toast.error(error.response.data);
            }
        }

        fetchContent();
    }, [])
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

            {step === "1" && (<div className="assignments-container">
                {contentDetail?.length > 0 ? (
                    <div className="assignments-list">
                        {contentDetail.map((content, index) => (
                            <div onClick={()=>{setContentId(content.id); console.log(content.id); setStep("2")}} key={index} className="assignment-card">
                                <div className="assignment-headers">
                                    <CiFolderOn style={{ fontSize: "30px" }} /><h3>{content.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No contents available.</p>
                )}

                <button className="add-assignment-btn">
                    Add content <FaPlus className='chat-icon' />
                </button>

                {/* {showForm && <AssignmentForm onClose={() => setShowForm(false)} id={programId} userId={userId} onNewAssignment={onNewAssignment} />}
                {showSubmitForm && <SubmitAssignmentForm assignmentId={selectedAssignmentId} selectedAssignmentTitle={selectedAssignmentTitle} programId={programId} userId={userId} onClose={() => setShowSubmitForm(false)} />} */}
            </div>)}
            {step === "2" && (<TeacherContentDetail contentId={contentId} setStep = {setStep}/>)}
        </div>
    )
}

export default TeacherContents
