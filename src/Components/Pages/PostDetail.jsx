import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Header from './Header';
import LeftAside from './LeftAside';
import RightAside from './RightAside';
import { FaArrowRight } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import "../CSS/PostDetail.css"
import { jwtDecode } from "jwt-decode";

const PostDetail = () => {

    const { postId } = useParams(); // Get postId from URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [push, setPush] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const URL = `${import.meta.env.VITE_API_POSTS}/get-post/${postId}`;
            try {
                const response = await axios.get(URL);
                setPost(response.data);
                setLoading(false);
                console.log("Response Data:", response.data);
            } catch (error) {
                toast.error(error.response?.data ?? "Something went wrong");
                setLoading(false);
            }
        };
        fetchData();
    }, [postId, push]);

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>Post not found</p>;

    const getDecodedToken = () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (token) {
            try {
                // Decode the token
                const decoded = jwtDecode(token); // Decode the token
                console.log(`this decode: ${decoded}`); // The decoded token payload
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

    const CommentPost = async (postId) => {
        const decodedToken = getDecodedToken(); // Get user info from JWT
    
        if (!decodedToken || !decodedToken.id) {
            console.error("User ID is missing from the decoded token!");
            toast.error("User ID is missing!");
            return;
        }
    
        // Ensure that the comment is not empty
        if (!comment || comment.trim() === "") {
            toast.error("Please write something to comment");
            return;
        }
    
        const URL = `${import.meta.env.VITE_API_COMMENTPOST}/${postId}/${decodedToken.id}`;
    
        try {
            // Send the comment via a POST request
            const response = await axios.post(URL, { comments: comment });
            
            // Handle successful response
            setPush(!push);
            toast.success("Commented successfully");
    
            // Clear the comment input after success
            setComment("");
        } catch (error) {
            // Handle error if the request fails
            console.error("Error commenting on post:", error.response?.data);
            toast.error("Failed to comment. Please try again later.");
        }
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

                    <div className="profile-containers">
                        <div style={{ position: "relative" }}>


                            <div className="posts">
                                <div className="post-header">
                                    <div className='avatar'>
                                        <img
                                            src={post?.fileUrl}  // Use optional chaining
                                            alt="User"
                                            className="user-avatar"
                                        />
                                    </div>
                                    <div className="user-info">
                                        <h4>{post?.user?.firstName} {post?.user?.lastName}</h4>
                                        <p>{post?.date}</p>
                                    </div>
                                </div>
                                <p className="post-content">
                                    <FaArrowRight /> {post?.caption}
                                </p>
                                <img
                                    src={post?.fileUrl}
                                    alt="Post"
                                    className="post-image"
                                />

                                <div>

                                    <h3 style={{ textAlign: "start" }}>Comments Section:</h3>
                                    <div className="post-headers">

                                        <div className="user-info" >
                                            {post?.comments?.map((comment, index) => (

                                                <div key={index} className="comment" style={{ display: "flex", textAlign: "start", gap: "5px", alignItems: "center" }}>
                                                    <div className='avatars'>
                                                        <img
                                                            src={post?.fileUrl}  // Use optional chaining
                                                            alt="User"
                                                            className="user-avatar"
                                                        />
                                                    </div>
                                                    <h4>{comment.user.firstName} {comment.user.lastName}: </h4>
                                                    <p>{comment.comment}</p>
                                                </div>
                                            ))}

                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div className="comment-input-section">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e)=>setComment(e.target.value)}
                                    className="comment-input"
                                    placeholder="Add a comment..."
                                />
                                <button className="send-btn" onClick={()=>CommentPost(post.id)}>Send</button>
                            </div>
                        </div>
                    </div>

                    <div className='right-section'>
                        <RightAside />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PostDetail
