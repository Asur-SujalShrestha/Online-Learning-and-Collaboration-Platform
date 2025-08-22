import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const appID = 1150556432;
const serverSecret = "2f22fb595e331cfeea8b084222cba150";

const VoiceCall = ({ userId, userName, receiverId, isOpen, onClose }) => {
  const containerRef = useRef(null);
  const sortedRoomId = `${Math.min(Number(userId), Number(receiverId))}_${Math.max(Number(userId), Number(receiverId))}`;

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      sortedRoomId,
      userId.toString(),
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      userID: userId.toString(),
      userName: userName,
      roomID: sortedRoomId,
      showPreJoinView: false,
      turnOnCameraWhenJoining: false, // disables camera
      turnOnMicrophoneWhenJoining: true, // enables mic
      showMyCameraToggleButton: false,
      showCameraToggleButton: false,
      showAudioVideoSettingsButton: false,
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="video-call-overlay">
        <button className="closebutton" onClick={()=>{onClose; window.location.reload()}} style={{position:"absolute", top:"20px", right:"20px", background:"none", border:"none", color:"white", padding:" 5px 10px"}}>X</button>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default VoiceCall;
