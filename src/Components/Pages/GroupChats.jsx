import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import WebSocketService from "../Services/WebSocketService";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../CSS/Chats.css";
import VideoChat from "./VideoChat";
import { IoCall} from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import GroupVideoChat from "./GroupVideoChat";
import VoiceCall from "./VoiceCall";

function GroupChats({ group, onBack }) {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");
    const userId = token ? jwtDecode(token).id : null;
    const senderProfile = token ? jwtDecode(token).profilePic : null;
    const firstName = token ? jwtDecode(token).firstName : null;

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const messageEndRef = useRef(null);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [showVoiceCall, setShowVoiceCall] = useState(false);

    useEffect(() => {
        setMessages([]);

        // Fetch past group messages
        const fetchGroupMessages = async () => {
            try {
                const response = await axios.get(
                    `https://192.168.101.3:8081/collapp/get-group-messages/${group.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }
                );
                setMessages(response.data);
                scrollToBottom();
            } catch (error) {
                console.error("Error fetching group messages:", error);
            }
        };

        fetchGroupMessages();

        // ✅ Now using connectToGroup instead of manual subscription
        WebSocketService.connectToGroup(group.id, (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            WebSocketService.disconnect(); // Clean up WebSocket connection
        };
    }, [group.id]);


    const scrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = () => {
        if (messageInput.trim() === "") return;

        const newMessage = {
            senderId: userId,
            groupId: group.id,
            message: messageInput,
            timestamp: new Date().toISOString(),
            status: "MESSAGE",
        };

        WebSocketService.sendGroupMessage(group.id, newMessage);
        if (newMessage.senderId !== userId) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
        setMessageInput("");
        scrollToBottom();
    };

    return (
        <div className="chat-containers">
            <div className="chat-section-main">
                <div className="chat-header">
                    <div className="avatar-title">
                        <button className="back-buttons" onClick={onBack}>
                            <IoArrowBackSharp
                                style={{
                                    color: "#fff",
                                    fontSize: "24px",
                                    padding: "0 7px 0 0",
                                }}
                            />
                        </button>
                        <div className="group-avatar">G</div>
                        <h3 style={{ margin: "0" }}>{group.name}</h3>
                    </div>
                    <div className='call-list'>
                        <IoCall className='call' onClick={() => setShowVoiceCall(true)} style={{color:"#fff"}}/>
                        <FaVideo className='call' onClick={() => setShowVideoCall(true)} style={{ color: "#fff" }} />
                        <HiDotsVertical className='call' />
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => {
                        const isSentByUser = msg.senderId === userId || msg.sender?.id == userId;
                        return (
                            <div key={index} className={isSentByUser ? "message right" : "message left"}>
                                {!isSentByUser && (
                                    <img
                                        src={msg.senderProfile || "/default-avatar.png"}
                                        className="Profile-pic left"
                                        alt="Sender"
                                    />
                                )}
                                <div className={`message-box ${isSentByUser ? "sent" : "received"}`}>
                                    {msg.message}
                                </div>
                                {isSentByUser && (
                                    <img
                                        src={senderProfile !== "null" ? senderProfile : "/default-avatar.png"}
                                        className="Profile-pic right"
                                        alt="Sender"
                                    />
                                )}
                            </div>
                        );
                    })}
                    <div ref={messageEndRef}></div>
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <IoIosSend className="send-icon" onClick={sendMessage} />
                </div>
            </div>
            <GroupVideoChat
                 isOpen={showVideoCall}
                 onClose={() => setShowVideoCall(false)}
                 userId={userId}            
                 userName={firstName}       
                 groupId={`group-${group.id}`} 
            />
            <VoiceCall 
                isOpen={showVoiceCall}
                onClose={() => setShowVoiceCall(false)}
                userId={userId}
                userName={firstName}
                receiverId={`group-${group.id}`}/>
        </div>
    );
}

export default GroupChats;
