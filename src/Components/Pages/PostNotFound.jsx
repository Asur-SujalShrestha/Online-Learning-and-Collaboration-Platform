import React from 'react'
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import "../CSS/PostNotFound.css";

function PostNotFound() {
  return (
    <div className="container-postNotFound">
      <div className="content-box">
        <AlertTriangle className="icon" />
        <h1 className="title">Post Not Found</h1>
        <p className="message">
          Sorry, the post you are looking for does not exist or has been deleted.
        </p>
        <Link to="/home" className="back-button">
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default PostNotFound
