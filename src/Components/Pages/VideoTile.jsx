import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, 
  Monitor, PhoneOff, Settings, User
} from 'react-feather';
import '../CSS/VideoChat.css';

// VideoTile Component
const VideoTile = ({ isLocal, videoRef, stream, username, userId }) => {
  const videoElementRef = useRef(null);
  const actualVideoRef = isLocal ? videoRef : videoElementRef;

  useEffect(() => {
    if (!isLocal && stream && actualVideoRef.current) {
      actualVideoRef.current.srcObject = stream;
    }
  }, [isLocal, stream]);

  return (
    <div className={`video-tile ${isLocal ? 'local-video' : 'remote-video'}`}>
      <video ref={actualVideoRef} autoPlay playsInline muted={isLocal} />
      <div className="video-user-info">
        <span className="username">{username}</span>
        {isLocal && <span className="local-badge">You</span>}
      </div>
    </div>
  );
};

export default VideoTile;