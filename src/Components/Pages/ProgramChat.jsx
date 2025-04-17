import { useEffect, useRef, useState } from "react";
import WebSocketService from "../Services/WebSocketService";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import "../CSS/Chats.css";
import { jwtDecode } from "jwt-decode";
import { IoCall } from "react-icons/io5";
import { FaPlus, FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import GroupVideoChat from "./GroupVideoChat";

function ProgramChat({ programId, programDetail }) {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");
    const userId = token ? jwtDecode(token).id : null;
    const firstName = token ? jwtDecode(token).firstName : null;
    const senderProfile = token ? jwtDecode(token).profilePic : null;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const messageEndRef = useRef(null);
    const [showVideoCall, setShowVideoCall] = useState(false);

    useEffect(() => {
        setMessages([]);
        console.log(programId);

        // Fetch past program messages
        const fetchProgramMessages = async () => {
            try {
                const response = await axios.get(
                    `https://192.168.101.3:8081/collapp/get-program-messages/${programId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }
                );
                setMessages(response.data);
                scrollToBottom();
            } catch (error) {
                console.error("Error fetching program messages:", error);
            }
        };

        fetchProgramMessages();

        // ✅ Connect to WebSocket for program messages
        WebSocketService.connectToProgram(programId, (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            WebSocketService.disconnect(); // Clean up WebSocket connection
        };
    }, [programId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = () => {
        if (messageInput.trim() === "") return;

        const newMessage = {
            senderId: userId,
            groupId: programId,
            message: messageInput,
            timestamp: new Date().toISOString(),
            status: "MESSAGE",
        };

        WebSocketService.sendProgramMessage(programId, newMessage);
        if (newMessage.senderId !== userId) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
        setMessageInput("");
        scrollToBottom();
    };

    return (
        <div className="chat-section">
            <div className="chat-section-main">
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
                        <FaVideo className='call' onClick={() => setShowVideoCall(true)} style={{ color: "#fff" }}/>
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
                    <FaPlus className='chat-icon' />
                    <HiOutlinePhoto className='chat-icon' />
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
                 groupId={`program-${programId}`} 
            />
        </div>
    );
}

export default ProgramChat;
