import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Header from './Header';
import LeftAside from './LeftAside';
import RightAside from './RightAside';
import { FaHeart, FaRegComment, FaShare, FaBookmark, FaEllipsisH, FaArrowLeft } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { jwtDecode } from "jwt-decode";
import PostNotFound from './PostNotFound';
import "../CSS/PostDetail.css";
import { useNavigate } from 'react-router-dom';

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [push, setPush] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const URL = `${import.meta.env.VITE_API_POSTS}/get-post/${postId}`;
            try {
                const response = await axios.get(URL);
                setPost(response.data);
                checkIfLiked(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast.error("Failed to load post");
            }
        };
        fetchData();
    }, [postId, push]);

    const getDecodedToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error('Failed to decode token:', error);
                return null;
            }
        }
        return null;
    };

    const checkIfLiked = (postData) => {
        const decoded = getDecodedToken();
        if (decoded && postData?.likes) {
            const liked = postData.likes.some(like => like.users.email === decoded.Email);
            setIsLiked(liked);
        }
    };

    const likePost = async () => {
        const decodedToken = getDecodedToken();
        if (!decodedToken?.id) {
            toast.error("Please login to like posts");
            return;
        }

        const URL = `${import.meta.env.VITE_APT_LIKEPOST}/${postId}/${decodedToken.id}`;
        try {
            await axios.post(URL);
            setPush(!push);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error liking post:", error.response?.data);
            toast.error("Failed to like post");
        }
    };

    const CommentPost = async () => {
        const decodedToken = getDecodedToken();
    
        if (!decodedToken?.id) {
            toast.error("Please login to comment");
            return;
        }
    
        if (!comment.trim()) {
            toast.error("Please write something to comment");
            return;
        }
    
        const URL = `${import.meta.env.VITE_API_COMMENTPOST}/${postId}/${decodedToken.id}`;
    
        try {
            await axios.post(URL, { comments: comment });
            setPush(!push);
            toast.success("Comment added");
            setComment("");
        } catch (error) {
            console.error("Error commenting:", error.response?.data);
            toast.error("Failed to add comment");
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
        </div>
    );
    
    if (!post) return <PostNotFound />;

    return (
        <div className="post-detail-container">
            <Header />
            
            <div className="post-detail-content">
                <LeftAside />
                
                <main className="post-detail-main">
                    <div className="post-back-button" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Back to Feed
                    </div>

                    <div className="post-card">
                        <div className="post-header">
                            <div className="user-info">
                                <img
                                    src={post.user?.profilePic || '/default-avatar.png'}
                                    alt="User"
                                    className="user-avatar"
                                />
                                <div>
                                    <h3>{post.user?.firstName} {post.user?.lastName}</h3>
                                    <p className="post-time">{new Date(post.date).toLocaleString()}</p>
                                </div>
                            </div>
                            
                        </div>
                        
                        <p className="post-caption">{post.caption}</p>
                        
                        {post.fileUrl && (
                            <div className="post-media">
                                <img
                                    src={post.fileUrl}
                                    alt="Post"
                                    className="post-image"
                                />
                            </div>
                        )}
                        
                        <div className="post-stats">
                            <div className="likes-count">
                                <FaHeart className={isLiked ? 'liked-icon' : ''} />
                                <span>{post.likes?.length || 0} likes</span>
                            </div>
                            <div className="comments-count">
                                <span>{post.comments?.length || 0} comments</span>
                            </div>
                        </div>
                        
                        <div className="post-actions">
                            <button 
                                className={`post-action-btn ${isLiked ? 'active' : ''}`}
                                onClick={likePost}
                            >
                                <FaHeart className="action-icon" />
                                <span>Like</span>
                            </button>
                            <button className="post-action-btn">
                                <FaRegComment className="action-icon" />
                                <span>Comment</span>
                            </button>
                            
                        </div>
                        
                        <div className="comments-section">
                            <h3>Comments</h3>
                            {post.comments?.length > 0 ? (
                                <div className="comments-list">
                                    {post.comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <img
                                                src={comment.user?.profilePic || '/default-avatar.png'}
                                                alt="User"
                                                className="comment-avatar"
                                            />
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <span className="comment-author">{comment.user?.firstName} {comment.user?.lastName}</span>
                                                    <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="comment-text">{comment.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-comments">No comments yet. Be the first to comment!</p>
                            )}
                            
                            <div className="add-comment">
                                <img
                                    src={getDecodedToken()?.profilePic || '/default-avatar.png'}
                                    alt="User"
                                    className="comment-avatar"
                                />
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="comment-input"
                                    onKeyPress={(e) => e.key === 'Enter' && CommentPost()}
                                />
                                <button 
                                    className="send-comment-btn"
                                    onClick={CommentPost}
                                    disabled={!comment.trim()}
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                
                <RightAside />
            </div>
        </div>
    );
};

export default PostDetail;