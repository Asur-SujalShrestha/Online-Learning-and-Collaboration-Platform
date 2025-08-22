import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaPaperclip } from "react-icons/fa6";
import { IoCall, IoArrowBackSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";
import { BsCheck2All } from "react-icons/bs";
import WebSocketService from '../Services/WebSocketService';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import "../CSS/Chats.css";
import VideoChat from './VideoChat';
import VoiceCall from './VoiceCall';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

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
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages([]);

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`https://192.168.101.3:8081/collapp/get-messages`, {
                    params: { senderId: userId, receiverId: receiver.id },
                });
                setMessages(response.data);
                setTimeout(scrollToBottom, 100);
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
                setTimeout(scrollToBottom, 100);
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
        setTimeout(scrollToBottom, 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
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

            const fileUrl = response.data;
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
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const sendImage = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("file", selectedImage);

        try {
            const response = await axios.post("http://localhost:8081/collapp/upload-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            const fileUrl = response.data;
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
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const formatTime = (timestamp) => {
        return format(new Date(timestamp), 'h:mm a');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-header-content">
                    <button className="back-button" onClick={onBack}>
                        <IoArrowBackSharp className="back-icon" />
                    </button>
                    <div className="user-info">
                        <img 
                            src={receiver.profilePic !== "null" ? receiver.profilePic : "/default-avatar.png"} 
                            className="profile-pic" 
                            alt={receiver.firstName}
                        />
                        <div className="user-details">
                            <h3>{receiver.firstName} {receiver.lastName}</h3>
                            <p>{isTyping ? 'typing...' : 'online'}</p>
                        </div>
                    </div>
                    <div className="call-actions">
                        <button className="call-btn" onClick={() => setShowVoiceCall(true)}>
                            <IoCall className="call-icon" />
                        </button>
                        <button className="call-btn" onClick={() => setShowVideoCall(true)}>
                            <FaVideo className="call-icon" />
                        </button>
                        <button className="menu-btn">
                            <HiDotsVertical className="menu-icon" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                <AnimatePresence>
                    {messages.map((msg, index) => {
                        const isSentByUser = msg.sender?.id === userId || msg.senderId === userId;
                        const messageTime = formatTime(msg.timestamp);
                        
                        return (
                            <motion.div
                                key={index}
                                className={`message ${isSentByUser ? 'right' : 'left'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {!isSentByUser && (
                                    <img 
                                        src={receiver.profilePic !== "null" ? receiver.profilePic : "/default-avatar.png"} 
                                        className="profile-pic left" 
                                        alt="Receiver" 
                                    />
                                )}
                                <div className={`message-content ${isSentByUser ? 'sent' : 'received'}`}>
                                    {msg.status === "IMAGE" ? (
                                        <div className="image-message">
                                            <img src={msg.message} alt="Sent" className="message-image" />
                                            <span className="message-time">{messageTime}</span>
                                        </div>
                                    ) : msg.status === "FILE" ? (
                                        <div className="file-message">
                                            <div className="file-info">
                                                <FaPaperclip className="file-icon" />
                                                <a 
                                                    href={msg.message} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="file-link"
                                                >
                                                    {msg.message.split('/').pop()}
                                                </a>
                                            </div>
                                            <span className="message-time">{messageTime}</span>
                                        </div>
                                    ) : (
                                        <div className="text-message">
                                            <p>{msg.message}</p>
                                            <div className="message-meta">
                                                <span className="message-time">{messageTime}</span>
                                                {isSentByUser && <BsCheck2All className="read-receipt" />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isSentByUser && (
                                    <img 
                                        src={senderProfile !== "null" ? senderProfile : "/default-avatar.png"} 
                                        className="profile-pic right" 
                                        alt="Sender" 
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messageEndRef} />
            </div>

            <div className="chat-input-container">
                <div className="attachment-options">
                    <button className="attach-btn" onClick={() => fileInputRef.current.click()}>
                        <FaPaperclip className="attach-icon" />
                    </button>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <button className="attach-btn" onClick={handlePhotoClick}>
                        <HiOutlinePhoto className="attach-icon" />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                    <button className="attach-btn">
                        <HiOutlineEmojiHappy className="attach-icon" />
                    </button>
                </div>
                <div className="message-input-wrapper">
                    <textarea
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                    />
                    <button 
                        className="send-button" 
                        onClick={sendMessage}
                        disabled={!messageInput.trim()}
                    >
                        <IoIosSend className="send-icon" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {filePreview && (
                    <motion.div 
                        className="preview-modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="preview-content">
                            <h4>Send File</h4>
                            <p>{selectedFile?.name}</p>
                            <div className="preview-actions">
                                <button className="cancel-btn" onClick={() => setFilePreview(false)}>
                                    Cancel
                                </button>
                                <button className="send-btn" onClick={sendFile}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {imagePreview && (
                    <motion.div 
                        className="preview-modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="preview-content">
                            <h4>Send Image</h4>
                            <img 
                                src={URL.createObjectURL(selectedImage)} 
                                alt="Preview" 
                                className="image-preview"
                            />
                            <div className="preview-actions">
                                <button className="cancel-btn" onClick={() => setImagePreview(false)}>
                                    Cancel
                                </button>
                                <button className="send-btn" onClick={sendImage}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                receiverId={receiver.id}
            />
        </div>
    );
}

export default Chats;