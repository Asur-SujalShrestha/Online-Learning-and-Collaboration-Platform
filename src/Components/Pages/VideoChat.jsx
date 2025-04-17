// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// import '../CSS/VideoChat.css';
// import VideoGrid from './VideoGrid';
// import ParticipantsList from './ParticipantsList';
// import VideoControls from './VideoControls';
// import axios from 'axios';
// import { Client } from "@stomp/stompjs";
// import { jwtDecode } from 'jwt-decode';

// const VideoChat = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const [isConnected, setIsConnected] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [roomInfo, setRoomInfo] = useState(null);
//   const SOCKET_URL = "https://192.168.101.3:8081/video-chat"; // Direct WebSocket URL
//   const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");
//   const [stompClient, setStompClient] = useState(null);
//     const remoteVideoRef = useRef(null);
//     const peerConnection = useRef(null);

//   // Refs
//   const stompClientRef = useRef(null);
//   const peerConnectionsRef = useRef({});
//   const localVideoRef = useRef(null);

//   // User info - in a real app, get from auth context
//   let userId = `user_${Math.random().toString(36).substring(2, 9)}`;
// let username = 'Anonymous User';

// if (token) {
//   try {
//     const decodedToken = jwtDecode(token);
//     userId = decodedToken.id; // Use actual user ID
//     username = decodedToken.firstName || 'Anonymous User';
//   } catch (error) {
//     console.error("Error decoding token:", error);
//   }
// }

//   const iceServers = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' }
//     ]
//   };

//   // Initialize the video chat
//   useEffect(() => {
//     const initializeVideoChat = async () => {
//       // console.log(roomId);
//       try {
//         const response = await axios.get(`https://192.168.101.3:8081/api/rooms/${roomId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setRoomInfo(response.data);

//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         setLocalStream(stream);
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//         const socket = new SockJS(SOCKET_URL);
//         const stompClient = Stomp.over(socket);
//         stompClientRef.current = stompClient;

//         stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
//           setIsConnected(true);
//           stompClient.subscribe(`/user/topic/signal`, (message) => handleSignal(JSON.parse(message.body)));
//           stompClient.subscribe(`/topic/room/${roomId}`, (message) => handleRoomUpdates(JSON.parse(message.body)));
//           joinRoom();
//         }, (error) => console.error('WebSocket connection error:', error));
//       } catch (error) {
//         console.error('Error initializing video chat:', error);
//       }
//     };

//     initializeVideoChat();
//     return () => leaveRoom();
//   }, [roomId]);


//   const joinRoom = () => {
//     if (!stompClientRef.current) return;

//     console.log('Joining room:', roomId);
//     stompClientRef.current.send('/app/join', {}, JSON.stringify({
//       type: 'join',
//       roomId,
//       userId, // No `.current` needed
//       data: { username, timestamp: Date.now() }
//     }));
//   };


//   const leaveRoom = () => {
//     Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
//     peerConnectionsRef.current = {};
//     localStream?.getTracks().forEach(track => track.stop());

//     if (stompClientRef.current?.connected) {
//       stompClientRef.current.send('/app/leave', {}, JSON.stringify({
//         type: 'leave',
//         roomId,
//         userId // No `.current` needed
//       }));
//       stompClientRef.current.deactivate();
//     }
//   };


//   const handleUserJoined = async (peerId) => {
//   // Prevent duplicate connections
//   if (peerConnectionsRef.current[peerId]) return;

//   console.log('New user joined:', peerId);

//   const peerConnection = new RTCPeerConnection(iceServers);
//   peerConnectionsRef.current[peerId] = peerConnection;

//   // Add local tracks
//   localStream?.getTracks().forEach(track => {
//     peerConnection.addTrack(track, localStream);
//   });

//   // Track handling
//   peerConnection.ontrack = (event) => {
//     console.log('Received remote track from', peerId);
//     // Handle remote stream
//   };

//   peerConnection.onicecandidate = event => {
//     if (event.candidate) {
//       sendSignal('ice-candidate', peerId, event.candidate);
//     }
//   };

//   try {
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     sendSignal('offer', peerId, offer);
//   } catch (error) {
//     console.error('Error creating offer:', error);
//   }
// };


//   const handleSignal = async (signal) => {
//     console.log('Received signal:', signal);
//     if (signal.userId === userId.current) return;
//     let peerConnection = peerConnectionsRef.current[signal.userId];
//     if (!peerConnection) {
//       peerConnection = new RTCPeerConnection(iceServers);
//       peerConnectionsRef.current[signal.userId] = peerConnection;
//       localStream?.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
//     }

//     switch (signal.type) {
//       case 'offer':
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data));
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         sendSignal('answer', signal.userId, answer);
//         break;
//       case 'answer':
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data));
//         break;
//       case 'ice-candidate':
//         await peerConnection.addIceCandidate(new RTCIceCandidate(signal.data));
//         break;
//       default:
//         console.warn('Unknown signal type:', signal.type);
//     }
//   };

//   const handleUserLeft = (peerId) => {
//     peerConnectionsRef.current[peerId]?.close();
//     delete peerConnectionsRef.current[peerId];
//   };

//   const sendSignal = (type, targetUserId, data) => {
//     if (!stompClientRef.current) return;

//     stompClientRef.current.send('/app/signal', {}, JSON.stringify({
//       type, roomId, userId, targetUserId, data
//     }));
//   };


//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         return videoTrack.enabled;
//       }
//     }
//     return false;
//   };

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         return audioTrack.enabled;
//       }
//     }
//     return false;
//   };

//   const shareScreen = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: true
//       });

//       // Replace video track
//       const videoTrack = screenStream.getVideoTracks()[0];

//       if (videoTrack) {
//         // Replace track in all peer connections
//         Object.values(peerConnectionsRef.current).forEach(pc => {
//           const sender = pc.getSenders().find(s => 
//             s.track && s.track.kind === 'video'
//           );

//           if (sender) {
//             sender.replaceTrack(videoTrack);
//           }
//         });

//         // Update local video
//         const oldTrack = localStream.getVideoTracks()[0];
//         if (oldTrack) {
//           localStream.removeTrack(oldTrack);
//           oldTrack.stop();
//         }

//         localStream.addTrack(videoTrack);

//         // When user stops sharing screen
//         videoTrack.onended = async () => {
//           // Get new camera stream
//           const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//           const newVideoTrack = newStream.getVideoTracks()[0];

//           // Replace in all peer connections
//           Object.values(peerConnectionsRef.current).forEach(pc => {
//             const sender = pc.getSenders().find(s => 
//               s.track && s.track.kind === 'video'
//             );

//             if (sender) {
//               sender.replaceTrack(newVideoTrack);
//             }
//           });

//           // Update local stream
//           const oldTrack = localStream.getVideoTracks()[0];
//           if (oldTrack) {
//             localStream.removeTrack(oldTrack);
//             oldTrack.stop();
//           }

//           localStream.addTrack(newVideoTrack);
//         };
//       }
//     } catch (error) {
//       console.error('Error sharing screen:', error);
//       alert('Failed to share screen');
//     }
//   };

//   const handleExit = () => {
//     leaveRoom();
//     navigate('/videocalls');
//   };

//   return (
//     <div className="video-chat-container">
//       <div className="video-chat-header">
//         <h2>{roomInfo?.name || 'Video Session'}</h2>
//         <div className="room-info">
//           <span>Room ID: {roomId}</span>
//           <button 
//             className="btn-copy" 
//             onClick={() => {
//               navigator.clipboard.writeText(roomId);
//               alert('Room ID copied to clipboard');
//             }}
//           >
//             Copy
//           </button>
//         </div>
//       </div>

//       <div className="video-main-content">
//         <VideoGrid 
//           localStream={localStream}
//           localVideoRef={localVideoRef}
//           participants={participants}
//           userId={userId.current}
//           username={username.current}
//         />

//         <ParticipantsList participants={participants} />
//       </div>

//       <VideoControls 
//         toggleAudio={toggleAudio}
//         toggleVideo={toggleVideo}
//         shareScreen={shareScreen}
//         exitRoom={handleExit}
//         isConnected={isConnected}
//       />
//     </div>
//   );
// };

// export default VideoChat;


import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const appID = 1150556432;
const serverSecret = "2f22fb595e331cfeea8b084222cba150";

const VideoChat = ({ userId, userName, receiverId, isOpen, onClose }) => {
  const containerRef = useRef(null);
  const sortedRoomId = `${Math.min(Number(userId), Number(receiverId))}_${Math.max(Number(userId), Number(receiverId))}`;
 // Unique room for this chat

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
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="video-call-overlay">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default VideoChat;
