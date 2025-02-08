import React, { useState } from 'react';
import "../CSS/Profile.css";
import LeftAside from './LeftAside';
import RightAside from './RightAside';
import Header from './Header';
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import UploadImage from './UploadImage';

function Profile() {
    const [step, setStep] = useState("1");

    const handleProfilePage = ()=>{
        setStep("1");
    }
  
    const handleUploadPic = ()=>{
        setStep("2");
    }
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

                    {step === "1" && (<div className="profile-container">
                        <div className='cover-photo'>
                            <img src="src\assets\images\mainPage1.png" alt="" />
                        </div>
                        <div className="profile-header">
                            <div className='profile-photo'>
                                <img
                                    src="src\assets\images\mainPage1.png"
                                    alt="Profile"
                                    className="profile-picture"
                                />
                            </div>

                            <h2>Sujan Shrestha</h2>
                            <p>Created at 2070-01-02</p>
                        </div>

                        <div className="post-box">
                            <input type="text" placeholder="Say something..." className="input-box" />
                            <button className="upload-btn">Upload</button>
                        </div>

                        <div className="button-group">
                            <button className="details-btn">View details</button>
                            <button className="upload-pic-btn" onClick={handleUploadPic}>Upload Pic</button>
                        </div>
                        <div className="post">
                            <div className="post-header">
                                <div className='avatar'>
                                    <img
                                        src="src\assets\images\mainPage1.png"
                                        alt="User"
                                        className="user-avatar"
                                    />
                                </div>
                                <div className="user-info">
                                    <h4>Sujan Shrestha</h4>
                                    <p>2069-09-25</p>
                                </div>
                            </div>
                            <p className="post-content">
                                Happy Dashain to all the students and staff of the college. Happy Dashain to all the
                                students and staff of the college. Happy Dashain to all the students and staff of the
                                college.
                            </p>
                            <img
                                src="src\assets\images\mainPage1.png"
                                alt="Post"
                                className="post-image"
                            />
                            <div className="button-group">
                                <button className="details-btn love-btn">Like <CiHeart style={{ fontSize: "18px" }} /></button>
                                <button className="upload-pic-btn comment-btn">Comment <FaRegComment /></button>
                            </div>
                        </div>

                        <div className="post">
                            <div className="post-header">
                                <div className='avatar'>
                                    <img
                                        src="src\assets\images\mainPage1.png"
                                        alt="User"
                                        className="user-avatar"
                                    />
                                </div>

                                <div className="user-info">
                                    <h4>Sujan Shrestha</h4>
                                    <p>2069-09-25</p>
                                </div>
                            </div>
                            <p className="post-content">
                                Happy Dashain to all the students and staff of the college. Happy Dashain to all the
                                students and staff of the college. Happy Dashain to all the students and staff of the
                                college.
                            </p>
                            <img
                                src="src\assets\images\mainPage1.png"
                                alt="Post"
                                className="post-image"
                            />
                            <div className="button-group">
                                <button className="details-btn love-btn">Like <CiHeart style={{ fontSize: "18px" }} /></button>
                                <button className="upload-pic-btn comment-btn">Comment <FaRegComment /></button>
                            </div>
                        </div>

                    </div>)}

                    {/* Upload Form */}

                    {step === "2" && (<div className="profile-container">
                        <UploadImage/>
                        <button onClick={handleProfilePage} className="details-btn">Back To Profile Page</button>
                        </div>
                    )}

                    <div className='right-section'>
                        <RightAside />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Profile
