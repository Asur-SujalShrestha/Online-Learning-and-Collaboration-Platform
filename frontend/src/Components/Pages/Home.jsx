import React, { useEffect, useState } from "react";
import Header from "./Header";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import { CiHeart, CiCirclePlus } from "react-icons/ci";
import { FaRegComment, FaHeart, FaEllipsisH } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoBookmarkOutline } from "react-icons/io5";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../CSS/Home.css";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [push, setPush] = useState(false);
    const [email, setEmail] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [newPostContent, setNewPostContent] = useState("");
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [postImage, setPostImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const URL = `${import.meta.env.VITE_API_POSTS}/get-all/social-media`;
            try {
                const response = await axios.get(URL);
                setPosts(response.data);
            } catch (err) {
                setError(err.message);
                console.error(err.message);
            }
            getDecodedToken();
        };
        fetchData();
    }, [push]);

    const getDecodedToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
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
        const decodedToken = getDecodedToken();
        if (!decodedToken?.id) {
            console.error("User ID is missing from the decoded token!");
            return;
        }

        const URL = `${import.meta.env.VITE_APT_LIKEPOST}/${postId}/${decodedToken.id}`;
        try {
            await axios.post(URL);
            setPush(!push);
        } catch (error) {
            console.error("Error liking post:", error.response?.data);
        }
    };

    const goToPostDetails = (postId) => {
        navigate(`/postDetail/${postId}`);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const createPost = async () => {
        // Implement post creation logic here
        console.log("Creating post:", newPostContent, postImage);
        // After successful post creation:
        setIsCreatingPost(false);
        setNewPostContent("");
        setPostImage(null);
        setPreviewImage(null);
        setPush(!push); // Refresh posts
    };

    return (
        <div className="home-container">
            <Header />
            
            <div className="home-content">
                <LeftAside />
                
                <main className="main-content">
                    

                    {/* Post Creation Modal */}
                    {isCreatingPost && (
                        <div className="post-creation-modal">
                            <div className="modal-header">
                                <h3>Create Post</h3>
                                <button 
                                    className="close-modal"
                                    onClick={() => {
                                        setIsCreatingPost(false);
                                        setNewPostContent("");
                                        setPostImage(null);
                                        setPreviewImage(null);
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-content">
                                <textarea
                                    placeholder="What's on your mind?"
                                    className="post-textarea"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                />
                                {previewImage && (
                                    <div className="image-preview">
                                        <img src={previewImage} alt="Preview" />
                                    </div>
                                )}
                                <div className="modal-actions">
                                    <label className="upload-image-btn">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                        Add Photo
                                    </label>
                                    <button 
                                        className="post-submit-btn"
                                        onClick={createPost}
                                        disabled={!newPostContent && !postImage}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Posts Feed */}
                    <div className="posts-feed">
                        {posts.map((post, index) => (
                            <div className="post-card" key={index}>
                                <div className="post-header">
                                    <div className="user-info">
                                        <img
                                            src={post.user.profilePic || "https://via.placeholder.com/40"}
                                            alt="User"
                                            className="home-user-avatar"
                                        />
                                        <div>
                                            <h4>{post.user.firstName} {post.user.lastName}</h4>
                                            <p className="post-time">{post.date}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <p className="post-caption">{post.caption}</p>
                                
                                {post.fileUrl && (
                                    <div className="post-media">
                                        <img
                                            src={post.fileUrl}
                                            alt="Post"
                                            className="home-post-image"
                                            onClick={() => setSelectedImage(post.fileUrl)}
                                        />
                                    </div>
                                )}
                                
                                <div className="post-stats">
                                    <div className="likes-count">
                                        <FaHeart className="liked-icon" />
                                        <span>{post.likes.length}</span>
                                    </div>
                                    <div className="comments-count">
                                        <span>{post.comments.length} comments</span>
                                    </div>
                                </div>
                                
                                <div className="post-actions">
                                    <button 
                                        className={`post-action-btn ${post.likes.some(like => like.users.email === email) ? 'active' : ''}`}
                                        onClick={() => likePost(post.id)}
                                    >
                                        {post.likes.some(like => like.users.email === email) ? (
                                            <FaHeart className="action-icon" />
                                        ) : (
                                            <CiHeart className="action-icon" />
                                        )}
                                        <span>Like</span>
                                    </button>
                                    <button 
                                        className="post-action-btn"
                                        onClick={() => goToPostDetails(post.id)}
                                    >
                                        <FaRegComment className="action-icon" />
                                        <span>Comment</span>
                                    </button>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                
                <RightAside />
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setSelectedImage(null)}>&times;</span>
                        <img src={selectedImage} alt="Enlarged Post" className="enlarged-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;