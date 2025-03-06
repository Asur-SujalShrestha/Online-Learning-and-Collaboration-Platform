import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import { Import } from 'lucide-react';
import "../CSS/Chats.css";
import { IoArrowBackSharp } from "react-icons/io5";

function Chats({ user, onBack }) {
    const [programDetail, setProgramDetail] = useState([]);
    return (
        <div className="chat-containers">
            <div className="chat-section-main">
                <div className="chat-header">
                    <div className='avatar-title'>
                    <button className="back-buttons" onClick={onBack}><IoArrowBackSharp style={{color:"#fff", fontSize:"24px", padding:"0 7px 0 0"}}/></button>
                        <img
                            src={user.profilePic !== "null" ? user.profilePic : "/default-avatar.png"}
                            className="Profile-pic"
                        />
                        <h3 style={{margin:"0"}}>{user.firstName} {user.lastName}</h3>
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
        </div>
    )
}

export default Chats
