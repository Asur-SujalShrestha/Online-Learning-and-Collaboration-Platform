import React, { useState } from 'react'
import "../CSS/ProgramDetail.css"
import { HiOutlinePhoto } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import ProgramSideMenu from './ProgramSideMenu';
import { FaPlus } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Header from './Header';
import { useParams } from 'react-router-dom';
import Assignment from './Assignment';

function ProgramDetail() {
    const { programName } = useParams();
    const [step, setStep] = useState("1");
    
    return (
        <>
            <div className="chat-container">
                <Header />
                <div style={{ display: "flex", flexDirection: "row", height: "89%" }}>
                    {/* Left Sidebar */}
                    <div className="left-sidebar">
                        <ProgramSideMenu step={step} setStep={setStep}/>
                    </div>

                    {/* Chat Section */}
                    {step === "1" ? (<div className="chat-section">
                        <div className="chat-header">
                            <div className='avatar-title'>
                                <img src="https://via.placeholder.com/40" alt="Profile" className="profile-pic" />
                                <h2>{programName}</h2>
                            </div>

                            <div className='call-list'>
                                <IoCall className='call' />
                                <FaVideo className='call' />
                                <HiDotsVertical className='call' />
                            </div>
                        </div>

                        <div className="chat-messages">
                            <div className="message left">
                                <img src="https://via.placeholder.com/30" alt="User" className="message-pic" />
                                <div className="message-box left-box">Hello, how are you?</div>
                            </div>

                            <div className="message right">
                                <div className="message-box right-box">I'm good, what about you?</div>
                                <img src="https://via.placeholder.com/30" alt="User" className="message-pic" />
                            </div>

                            <div className="message left">
                                <img src="https://via.placeholder.com/30" alt="User" className="message-pic" />
                                <div className="message-box left-box">I need help with the assignment.</div>
                            </div>
                            <div className="message right">
                                <div className="message-box right-box">Sure, let's discuss it.</div>
                                <img src="https://via.placeholder.com/30" alt="User" className="message-pic" />
                            </div>
                        </div>

                        <div className="chat-input">
                            <FaPlus className='chat-icon' />
                            <HiOutlinePhoto className='chat-icon' />
                            <input type="text" placeholder="Type a message..." />
                            <IoIosSend className="send-icon" />
                        </div>
                    </div>)
                        :

                        (
                            <Assignment/>
                        )}
                </div>
            </div>



        </>
    )
}

export default ProgramDetail
