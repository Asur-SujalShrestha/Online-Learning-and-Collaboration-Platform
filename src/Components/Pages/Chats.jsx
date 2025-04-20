import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { IoCall, IoArrowBackSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import WebSocketService from '../Services/WebSocketService';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import "../CSS/Chats.css";
import VideoChat from './VideoChat';
import VoiceCall from './VoiceCall';

function Chats({ receiver, onBack }) {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;
    const senderProfile = token ? jwtDecode(token).profilePic : null;
    const firstName = token ? jwtDecode(token).firstName : null;

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filePreview, setFilePreview] = useState(false);
    const [imagePreview, setImagePreview] = useState(false);
    const messageEndRef = useRef(null);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [showVoiceCall, setShowVoiceCall] = useState(false);

    const scrollToBottom = () => {
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
    };


    useEffect(() => {
        setMessages([]);

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`https://192.168.101.3:8081/collapp/get-messages`, {
                    params: { senderId: userId, receiverId: receiver.id },
                });
                setMessages(response.data);

                setTimeout(() => {
                    scrollToBottom();
                }, 100); // Short delay to allow UI update
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        WebSocketService.connect(userId, firstName, (message) => {
            if (
                (message.senderId === userId && message.receiverId === receiver.id) ||
                (message.senderId === receiver.id && message.receiverId === userId)
            ) {
                setMessages((prevMessages) => [...prevMessages, message]);
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }
        });

        return () => {
            WebSocketService.disconnect();
        };
    }, [receiver.id, userId]);


    const sendMessage = () => {
        if (messageInput.trim() === "") return;

        const newMessage = {
            senderId: userId,
            receiverId: receiver.id,
            message: messageInput,
            timestamp: new Date().toISOString(),
            status: "MESSAGE",
        };

        WebSocketService.sendPrivateMessage(receiver.id, newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageInput("");
        scrollToBottom();
    };

    const handlePhotoClick = () => {
        imageInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setFilePreview(true);
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setImagePreview(true);
    };

    const sendFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("http://localhost:8081/collapp/upload-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            const fileUrl = response.data; // Adjust based on backend response
            const fileMessage = {
                senderId: userId,
                receiverId: receiver.id,
                message: fileUrl,
                timestamp: new Date().toISOString(),
                status: "FILE",
            };

            WebSocketService.sendPrivateMessage(receiver.id, fileMessage);
            setMessages((prevMessages) => [...prevMessages, fileMessage]);
            setFilePreview(false);
            setSelectedFile(null);
            scrollToBottom();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const sendImage = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("file", selectedImage);

        try {
            console.log("Enter");

            const response = await axios.post("http://localhost:8081/collapp/upload-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });
            console.log("After");

            const fileUrl = response.data; // Adjust based on backend response
            const fileMessage = {
                senderId: userId,
                receiverId: receiver.id,
                message: fileUrl,
                timestamp: new Date().toISOString(),
                status: "IMAGE",
            };

            WebSocketService.sendPrivateMessage(receiver.id, fileMessage);
            setMessages((prevMessages) => [...prevMessages, fileMessage]);
            setImagePreview(false);
            setSelectedImage(null);
            scrollToBottom();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="chat-containers">
            <div className="chat-section-main">
                <div className="chat-header">
                    <div className='avatar-title'>
                        <button className="back-buttons" onClick={onBack}>
                            <IoArrowBackSharp style={{ color: "#fff", fontSize: "24px", padding: "0 7px 0 0" }} />
                        </button>
                        <img src={receiver.profilePic !== "null" ? receiver.profilePic : "/default-avatar.png"} className="Profile-pic" />
                        <h3 style={{ margin: "0" }}>{receiver.firstName} {receiver.lastName}</h3>
                    </div>
                    <div className='call-list'>
                        <IoCall className='call' onClick={() => setShowVoiceCall(true)} style={{color:"#fff"}} />
                        <FaVideo className='call' onClick={() => setShowVideoCall(true)} style={{color:"#fff"}}/>
                        <HiDotsVertical className='call' />
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => {
                        const isSentByUser = msg.sender?.id === userId || msg.senderId === userId;
                        return (
                            <div key={index} className={isSentByUser ? "message right" : "message left"}>
                                {!isSentByUser && (
                                    <img src={receiver.profilePic !== "null" ? receiver.profilePic : "/default-avatar.png"} className="Profile-pic left" alt="Receiver" />
                                )}
                                <div className={`message-box ${isSentByUser ? "sent" : "received"}`}>
                                    {msg.status === "IMAGE" ? (
                                        <img src={msg.message} alt="Sent image" className="sent-image" />
                                    ) : msg.status === "FILE" ? (
                                        <a href={msg.message} target="_blank" rel="noopener noreferrer" className="file-link">
                                            📄 View Attachment
                                        </a>
                                    ) : (
                                        msg.message
                                    )}
                                </div>
                                {isSentByUser && (
                                    <img src={senderProfile !== "null" ? senderProfile : "/default-avatar.png"} className="Profile-pic right" alt="Sender" />
                                )}
                            </div>
                        );
                    })}
                    <div ref={messageEndRef}></div>
                </div>

                <div className="chat-input">
                    <FaPlus className='chat-icon' onClick={() => fileInputRef.current.click()} />
                    <input
                        type="file"
                        accept=".pdf, .doc, .docx"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <HiOutlinePhoto className='chat-icon' onClick={handlePhotoClick} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                    <input type="text" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                    <IoIosSend className="send-icon" onClick={sendMessage} />
                </div>

                {filePreview && (
                    <div className="file-preview-modal">
                        <p>Selected File: {selectedFile?.name}</p>
                        <button onClick={sendFile}>Send File</button>
                        <button onClick={() => setFilePreview(false)}>Cancel</button>
                    </div>
                )}

                {imagePreview && (
                    <div className="file-preview-modal">
                        <p>Selected File: {selectedImage?.name}</p>
                        <button onClick={sendImage}>Send Image</button>
                        <button onClick={() => setImagePreview(false)}>Cancel</button>
                    </div>
                )}
            </div>
            <VideoChat
                isOpen={showVideoCall}
                onClose={() => setShowVideoCall(false)}
                userId={userId}
                userName={firstName}
                receiverId={receiver.id}
            />
            <VoiceCall 
                isOpen={showVoiceCall}
                onClose={() => setShowVoiceCall(false)}
                userId={userId}
                userName={firstName}
                receiverId={receiver.id}/>
        </div>
    );
}

export default Chats;
