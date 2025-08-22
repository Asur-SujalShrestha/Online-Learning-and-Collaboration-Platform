import React, { useEffect, useState } from 'react';
import "../CSS/Profile.css";
import LeftAside from './LeftAside';
import RightAside from './RightAside';
import Header from './Header';
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import UploadImage from './UploadImage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Profile() {
    const [step, setStep] = useState("1");
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;

    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchUserData();
            fetchUserPosts();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_USER}/get-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_POSTS}/get-post-by-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const postList = Array.isArray(response.data) ? response.data : [];
            console.log(postList);
            
            setPosts(postList);
        } catch (err) {
            console.error("Error fetching user posts:", err);
            setPosts([]); // Ensure posts is always an array
        }
    };
    
    

    const handleProfilePage = () => {
        setStep("1");
    };

    const handleUploadPic = () => {
        setStep("2");
    };

    return (
        <div>
            <div className='main-container'>
                <div className='header-section'>
                    <Header />
                </div>

                <div className='container'>
                    <div className='left-section'>
                        <LeftAside />
                    </div>

                    {/* Profile View */}
                    {step === "1" && (
                        <div className="profile-container">
                            <div className='cover-photo'>
                                <img src={userData?.profilePic || "/default-avatar.png"} alt="Cover" />
                            </div>

                            <div className="profile-header">
                                <div className='profile-photo'>
                                    <img
                                        src={userData?.profilePic || "/default-avatar.png"}
                                        alt="Profile"
                                        className="profile-picture"
                                    />
                                </div>

                                <h2>{userData?.firstName} {userData?.lastName}</h2>
                                <p>Created at {userData?.dob}</p>
                            </div>

                            <div className="post-box">
                                <input type="text" placeholder="Say something..." className="input-box" />
                                <button className="upload-btn">Upload</button>
                            </div>

                            <div className="button-group">
                                <button className="details-btn">View details</button>
                                <button className="upload-pic-btn" onClick={handleUploadPic}>Upload Pic</button>
                            </div>

                            {posts.map(post => (
                                <div key={post.id} className="post">
                                    <div className="post-header">
                                        <div className='avatar'>
                                            <img
                                                src={post.user.profilePic || "/default-avatar.png"}
                                                alt="User"
                                                className="user-avatar"
                                            />
                                        </div>
                                        <div className="user-info">
                                            <h4>{post.user.firstName} {post.user.lastName}</h4>
                                            <p>{post.date}</p>
                                        </div>
                                    </div>
                                    <p className="post-content">{post.caption}</p>
                                    <img
                                        src={post.fileUrl}
                                        alt="Post"
                                        className="post-image"
                                    />
                                    <div className="button-group">
                                        <button className="details-btn love-btn">
                                            Like <CiHeart style={{ fontSize: "18px" }} /> ({post.likes?.length || 0})
                                        </button>
                                        <button className="upload-pic-btn comment-btn">
                                            Comment <FaRegComment /> ({post.comments?.length || 0})
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload View */}
                    {step === "2" && (
                        <div className="profile-container">
                            <UploadImage />
                            <button onClick={handleProfilePage} className="details-btn">Back To Profile Page</button>
                        </div>
                    )}

                    <div className='right-section'>
                        <RightAside />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
