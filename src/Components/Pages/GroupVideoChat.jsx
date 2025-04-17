import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const appID = 1150556432;
const serverSecret = "2f22fb595e331cfeea8b084222cba150";

const GroupVideoChat = ({ userId, userName, groupId, isOpen, onClose }) => {
  const containerRef = useRef(null);
  const sortedRoomId = `${Math.min(Number(userId), Number(groupId))}_${Math.max(Number(userId), Number(groupId))}`;
 // Unique room for this chat

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        groupId.toString(),  
        userId.toString(),   
        userName
      );
      
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, 
        },
        userID: userId.toString(),
        userName: userName,
        roomID: groupId.toString(),
      });
      
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="video-call-overlay">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default GroupVideoChat;