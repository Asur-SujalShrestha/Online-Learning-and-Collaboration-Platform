import React from 'react';
import VideoTile from './VideoTile';

const VideoGrid = ({ localStream, localVideoRef, participants, userId, username }) => {
    const getGridClass = () => {
      const count = participants.length + 1;
      return count === 1 ? 'single-video' : count === 2 ? 'two-videos' : count <= 4 ? 'four-videos' : count <= 9 ? 'nine-videos' : 'many-videos';
    };
  
    return (
      <div className={`video-grid ${getGridClass()}`}>
        <VideoTile isLocal={true} videoRef={localVideoRef} username={username} userId={userId} />
        {participants.map((participant) => (
          <VideoTile key={participant.id} isLocal={false} stream={participant.stream} username={participant.username} userId={participant.id} />
        ))}
      </div>
    );
  };

export default VideoGrid;