import React, { useEffect, useState } from "react";
import "../CSS/Home.css";
import Header from "./Header";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";



const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [push, setPush] = useState(false);
    const [email, setEmail] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const URL = `${import.meta.env.VITE_API_POSTS}/get-all/social-media`
            try {
                const response = await axios.get(URL);
                setPosts(response.data); // Set the response data to state
                console.log(response.data);
            } catch (err) {
                setError(err.message);
                console.log(err.message);
            }
            console.log(getDecodedToken());
        };
        fetchData();
    }, [push]);

    const getDecodedToken = () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (token) {
            try {
                // Decode the token
                const decoded = jwtDecode(token); // Decode the token
                console.log(`this decode: ${decoded}`); // The decoded token payload
                setEmail(decoded.Email);
                return decoded;
            } catch (error) {
                console.error('Failed to decode token:', error);
                return null;
            }
        } else {
            console.log('No token found in localStorage');
            return null;
        }
    };


    const likePost = async (postId) => {
        const decodedToken = getDecodedToken(); // Get user info from JWT

        if (!decodedToken || !decodedToken.id) {
            console.error("User ID is missing from the decoded token!");
            return;
        }

        const URL = `${import.meta.env.VITE_APT_LIKEPOST}/${postId}/${decodedToken.id}`;
        console.log("Request URL:", URL); // Debugging URL

        try {
            const response = await axios.post(URL);
            setPush(!push);
            console.log(response.data);
        } catch (error) {
            console.error("Error liking post:", error.response?.data);
        }
    };

    const goToPostDetails = (postId) => {
        navigate(`/postDetail/${postId}`); // Redirect to PostPage with postId
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
                    <div className="home-profile-containers">
                        {posts.map((post, index) => (
                            <div className="home-post" key={index}>
                                <div className="post-header">
                                    <div className='avatar'>
                                        <img
                                            src={post.fileUrl}
                                            alt="User"
                                            className="user-avatar"
                                        />
                                    </div>
                                    <div className="user-info">
                                        <h4>{post.user.firstName} {post.user.lastName}</h4>
                                        <p>{post.date}</p>
                                    </div>
                                </div>
                                <p className="post-content">
                                    <FaArrowRight />{post.caption}
                                </p>
                                <img
                                    src={post.fileUrl}
                                    alt="Post"
                                    className="post-image"
                                    onClick={() => setSelectedImage(post.fileUrl)}
                                    style={{ cursor: "pointer" }}
                                />

                                <div className="button-group">
                                    <button style={{ backgroundColor: post.likes.some(like => like.users.email === email) ? "red" : "gray" }} onClick={() => likePost(post.id)} className="details-btn love-btn">{post.likes.length == 0 ? 'Like' : post.likes.length}<CiHeart style={{ fontSize: "18px" }} /></button>
                                    <button onClick={() => goToPostDetails(post.id)} className="upload-pic-btn comment-btn">{post.comments.length == 0 ? 'Comment' : post.comments.length}<FaRegComment /></button>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className='right-section'>
                        <RightAside />
                    </div>

                    {selectedImage && (
                        <div className="image-modal" onClick={() => setSelectedImage(null)}>
                            <div className="modal-contents" onClick={(e) => e.stopPropagation()}>
                                <span className="close-btnes" onClick={() => setSelectedImage(null)}>&times;</span>
                                <img src={selectedImage} alt="Enlarged Post" className="modal-image" />
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Home;