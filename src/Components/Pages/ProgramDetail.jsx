import React, { useEffect, useState } from 'react';
import "../CSS/ProgramDetail.css";
import { HiOutlinePhoto } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import ProgramSideMenu from './ProgramSideMenu';
import { FaPlus } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Header from './Header';
import { useParams } from 'react-router-dom';
import Assignment from './Assignment';
import toast from 'react-hot-toast';
import axios from 'axios';

function ProgramDetail() {
    const { programId } = useParams();
    const [step, setStep] = useState("1");
    const [programDetail, setProgramDetail] = useState(null);
    const [assignmentDetail, setAssignmentDetail] = useState(null);

    useEffect(() => {
        const fetchProgram = async () => {
            const URL = `${import.meta.env.VITE_API_PROGRAM}/getPrograms/${programId}`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');

            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.length > 0) {
                    setProgramDetail(response.data[0]); // Set the first program
                } else {
                    toast.error("Program not found");
                }
            } catch (error) {
                toast.error(error.response?.data || "An error occurred");
            }
        };

        fetchProgram();
    }, [programId]);

    useEffect(() => {
        const fetchAssignment = async () => {
            const URL = `${import.meta.env.VITE_API_ASSIGNMENT}/get-assignment/2`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.length > 0) {
                    setAssignmentDetail(response.data);
                } else {
                    toast.error("No assignments found");
                }
            } catch (error) {
                toast.error(error.response?.data || "An error occurred");
            }
        };
    
        fetchAssignment();
    }, [programId]);  // Add `token` if it might change dynamically
    


    return (
        <>
            <div className="chat-container">
                <Header />
                <div style={{ display: "flex", flexDirection: "row", height: "89%" }}>
                    <div className="left-sidebar">
                        <ProgramSideMenu step={step} setStep={setStep} />
                    </div>

                    {step === "1" ? (
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

                            <div className="chat-messages">
                                <div className="message left">
                                    <img src="" alt="User" className="message-pic" />
                                    <div className="message-box left-box">Hello, how are you?</div>
                                </div>

                                <div className="message right">
                                    <div className="message-box right-box">I'm good, what about you?</div>
                                    <img src="" alt="User" className="message-pic" />
                                </div>

                                <div className="message left">
                                    <img src="" alt="User" className="message-pic" />
                                    <div className="message-box left-box">I need help with the assignment.</div>
                                </div>

                                <div className="message right">
                                    <div className="message-box right-box">Sure, let's discuss it.</div>
                                    <img src="" alt="User" className="message-pic" />
                                </div>
                            </div>

                            <div className="chat-input">
                                <FaPlus className='chat-icon' />
                                <HiOutlinePhoto className='chat-icon' />
                                <input type="text" placeholder="Type a message..." />
                                <IoIosSend className="send-icon" />
                            </div>
                        </div>
                    ) : (
                        <Assignment assignmentDetail={assignmentDetail}/>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProgramDetail;
