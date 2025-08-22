import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, 
  Monitor, PhoneOff, Settings
} from 'react-feather';

const VideoControls = ({ toggleAudio, toggleVideo, shareScreen, exitRoom, isConnected }) => {
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
  
    return (
      <div className="video-controls">
        <button className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`} onClick={() => { setIsAudioEnabled(toggleAudio()); }} disabled={!isConnected}>{isAudioEnabled ? <Mic /> : <MicOff />}</button>
        <button className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`} onClick={() => { setIsVideoEnabled(toggleVideo()); }} disabled={!isConnected}>{isVideoEnabled ? <Video /> : <VideoOff />}</button>
        <button className="control-btn" onClick={shareScreen} disabled={!isConnected}><Monitor /></button>
        <button className="control-btn settings" onClick={() => setShowSettings(!showSettings)}><Settings /></button>
        <button className="control-btn exit" onClick={exitRoom}><PhoneOff /></button>
        {showSettings && (
          <div className="settings-panel">
            <h4>Settings</h4>
            <div className="settings-option"><label>Audio Input</label><select><option>Default Microphone</option></select></div>
            <div className="settings-option"><label>Video Input</label><select><option>Default Camera</option></select></div>
            <div className="settings-option"><label>Audio Output</label><select><option>Default Speaker</option></select></div>
          </div>
        )}
      </div>
    );
  };

export default VideoControls;