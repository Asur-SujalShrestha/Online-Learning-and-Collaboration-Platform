// import { jwtDecode } from 'jwt-decode';
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

// const ConferenceRoom = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStreams, setRemoteStreams] = useState({});  // { [username]: MediaStream }
//   const [chatMessages, setChatMessages] = useState([]);
//   const peerConnections = useRef({});     // { [username]: RTCPeerConnection }
//   const stompClientRef = useRef(null);
//   const {conferenceId} = useParams();
// const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
//       const userId = token ? jwtDecode(token).id : null;
//   useEffect(() => {
//     let stompClient;
//     // 1. Fetch existing participants by calling join API
//     fetch(`https://192.168.101.3:8081/api/conferences/${conferenceId}/join`, { method: 'POST',headers: { 
//         'Authorization': `Bearer ${token}`} })
//       .then(res => res.json())
//       .then(data => {
//         const otherUsers = data.participants || [];
//         // 2. Connect to WebSocket (STOMP)
//         const socket = new SockJS('https://192.168.101.3:8081/collapp/video');
//         stompClient = Stomp.over(socket);
//         stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
//           stompClientRef.current = stompClient;
//           // Subscribe to public topic for this conference (e.g., for chat or any broadcast events)
//           stompClient.subscribe(`/topic/conference/${conferenceId}/chat`, (msg) => {
//             const chat = JSON.parse(msg.body);
//             setChatMessages(prev => [...prev, chat]);
//           });
//           // Subscribe to private queue for this user (for direct signals)
//           stompClient.subscribe(`/user/queue/conference/${conferenceId}`, onSignalReceived);

//           // 3. After subscribing, get local media and notify others
//           startLocalMedia(otherUsers);
//         });
//       });

//     return () => {
//       // Cleanup on unmount: disconnect WS and close peer connections
//       if (stompClientRef.current) stompClientRef.current.disconnect();
//       Object.values(peerConnections.current).forEach(pc => pc.close());
//     };
//   }, [conferenceId]);

//   const startLocalMedia = async (otherUsers) => {
//     try {
//       // Get user media (camera & microphone)
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setLocalStream(stream);
//       // Show local video in a video element (e.g., via ref or video tag srcObject)
//       const localVideoElem = document.getElementById('localVideo');
//       if (localVideoElem) localVideoElem.srcObject = stream;

//       // Create a peer connection and offer for each existing participant
//       for (const user of otherUsers) {
//         setupPeerConnection(user, stream, true);  // true = initiate call (send offer)
//       }
//     } catch (err) {
//       console.error("Error accessing local media:", err);
//       // handle error (e.g., no webcam)
//     }
//   };
//   const iceConfig = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' }  // public STUN server for NAT traversal
//       // You can add TURN servers here as needed
//     ]
//   };

//   const sendSignal = (message) => {
//     if (stompClientRef.current && stompClientRef.current.connected) {
//       stompClientRef.current.send(`/app/signal/${conferenceId}`, {}, JSON.stringify(message));
//     }
//   };

//   const setupPeerConnection = async (peerUsername, stream, isInitiator = false) => {
//     // Create and store a peer connection for this peer
//     const pc = new RTCPeerConnection(iceConfig);
//     peerConnections.current[peerUsername] = pc;

//     // Add local media tracks to the peer connection
//     stream.getTracks().forEach(track => pc.addTrack(track, stream));

//     // ICE candidate event – send candidates to peer via signaling server
//     pc.onicecandidate = event => {
//       if (event.candidate) {
//         sendSignal({
//           type: "candidate",
//           target: peerUsername,
//           candidate: event.candidate.candidate,
//           sdpMid: event.candidate.sdpMid,
//           sdpMLineIndex: event.candidate.sdpMLineIndex
//         });
//       }
//     };

//     // Track event – remote stream has been received
//     pc.ontrack = event => {
//       const remoteStream = event.streams[0];
//       setRemoteStreams(prev => ({ ...prev, [peerUsername]: remoteStream }));
//       // Attach remoteStream to a video element for display
//       const videoElem = document.getElementById(`video-${peerUsername}`);
//       if (videoElem) videoElem.srcObject = remoteStream;
//     };

//     // If this client should initiate the call, create an offer
//     if (isInitiator) {
//       try {
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         // Send the SDP offer to the target peer via signaling
//         sendSignal({ type: "offer", target: peerUsername, sdp: offer.sdp });
//       } catch (err) {
//         console.error("Error creating offer for", peerUsername, err);
//       }
//     }
//   };

//   const navigate = useNavigate();

//   const onSignalReceived = async(msg) => {
//     const data = JSON.parse(msg.body);
//     const { type, sender, sdp, candidate, sdpMid, sdpMLineIndex, content } = data;
//     switch(type) {
//       case "offer":
//         // Another peer is offering to connect
//         // Create a new peer connection for the sender (if not exists)
//         if (!peerConnections.current[sender]) {
//           await setupPeerConnection(sender, localStream, false);
//         }
//         // Set their offer as remote description
//         const pcOffer = peerConnections.current[sender];
//         await pcOffer.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp }));
//         // Create an answer back to the offerer
//         const answer = await pcOffer.createAnswer();
//         await pcOffer.setLocalDescription(answer);
//         sendSignal({ type: "answer", target: sender, sdp: answer.sdp });
//         break;

//       case "answer":
//         // Our offer was accepted, remote provided an answer
//         if (peerConnections.current[sender]) {
//           const pcAnswer = peerConnections.current[sender];
//           await pcAnswer.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp }));
//         }
//         break;

//       case "candidate":
//         // Remote ICE candidate received
//         if (peerConnections.current[sender]) {
//           const pc = peerConnections.current[sender];
//           const iceCandidate = new RTCIceCandidate({ candidate, sdpMid, sdpMLineIndex });
//           pc.addIceCandidate(iceCandidate).catch(err => console.error("Error adding ICE candidate", err));
//         }
//         break;

//       case "chat":
//         // Chat message received (though we subscribe to chat topic separately, handling here if combined)
//         setChatMessages(prev => [...prev, { sender, content }]);
//         break;

//       case "newPeer":
//         // (Optional) If server broadcasts new participant joined, we could handle that:
//         // e.g., setupPeerConnection for the new peer and initiate an offer.
//         // For now, the offer exchange is handled by the new peer via join logic.
//         break;

//       default:
//         console.warn("Unknown message type:", type);
//     }
//   };

//   const handleChatInput = (e) => {
//     if (e.key === 'Enter') {
//       const content = e.target.value;
//       if (content.trim() === '') return;
//       // Send chat message via WebSocket
//       sendSignal({ type: "chat", content });
//       // Optionally, immediately add to local chatMessages for instant feedback
//       setChatMessages(prev => [...prev, { sender: "Me", content }]);
//       e.target.value = '';
//     }
//   };

//   const handleScreenShare = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       const screenTrack = screenStream.getVideoTracks()[0];
//       // Replace the video track in each peer connection with the screen track
//       Object.values(peerConnections.current).forEach(pc => {
//         const senders = pc.getSenders().filter(s => s.track.kind === 'video');
//         if (senders.length > 0) {
//           senders[0].replaceTrack(screenTrack);
//         }
//       });
//       // Also update local video to show the screen preview
//       const localVideoElem = document.getElementById('localVideo');
//       if (localVideoElem) localVideoElem.srcObject = screenStream;
//       // When screen sharing stops, you can revert back to camera
//       screenTrack.onended = () => {
//         // Replace with original camera track again after sharing is stopped
//         localStream.getVideoTracks().forEach(camTrack => {
//           Object.values(peerConnections.current).forEach(pc => {
//             const senders = pc.getSenders().filter(s => s.track.kind === 'video');
//             if (senders.length > 0) {
//               senders[0].replaceTrack(camTrack);
//             }
//           });
//         });
//         if (localVideoElem) localVideoElem.srcObject = localStream;
//       };
//     } catch (err) {
//       console.error("Screen share failed:", err);
//     }
//   };

// //   const iceConfig = { iceServers: [
// //     { urls: 'stun:stun.l.google.com:19302' },
// //     { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'pass' }
// //   ]};
// async function handleLeaveConference() {
//     // 1. Stop all local media tracks to release the camera and microphone
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());  // Stop each track&#8203;:contentReference[oaicite:3]{index=3}
//     }

//     // 2. Close all active RTCPeerConnection instances
//     peerConnections.forEach(pc => pc.close());  // Close each peer connection (frees ICE/TURN resources)&#8203;:contentReference[oaicite:4]{index=4}

//     // 3. Disconnect from the STOMP signaling WebSocket
//     if (stompClient && stompClient.connected) {
//       stompClient.disconnect();  // Gracefully close the WebSocket connection&#8203;:contentReference[oaicite:5]{index=5}
//     }

//     // 4. Notify the backend that the user has left the conference
//     try {
//       await fetch(`/api/conferences/${conferenceId}/leave`, { method: 'POST' });
//     } catch (err) {
//       console.error('Failed to notify backend about leaving', err);
//     }

//     // 5. Redirect the user to the home page (cleans up the conference UI)
//     navigate("/home");  // If using React Router (useHistory or useNavigate to programmatically redirect)
//   }


//   return (
//     <div className="conference-room">
//       {/* Local Video */}
//       <video id="localVideo" autoPlay muted playsInline />

//       {/* Remote Videos */}
//       {Object.entries(remoteStreams).map(([username, stream]) => (
//         <video key={username} id={`video-${username}`} autoPlay playsInline className="remote-video" />
//       ))}

//       {/* Chat UI */}
//       <div className="chat-panel">
//         <ul>
//           {chatMessages.map((msg, idx) => (
//             <li key={idx}><strong>{msg.sender}: </strong>{msg.content}</li>
//           ))}
//         </ul>
//         <input type="text" onKeyDown={handleChatInput} placeholder="Type a message..." />
//       </div>

//       {/* Controls */}
//       <button onClick={handleScreenShare}>Share Screen</button>
//       <button onClick={handleLeaveConference}>Leave</button>
//     </div>
//   );


// }

// export default ConferenceRoom;



import React, { useEffect, useState } from 'react';
import { HMSRoomProvider, useHMSActions, useHMSStore, selectIsConnectedToRoom } from '@100mslive/react-sdk';
import { jwtDecode } from 'jwt-decode';

function VideoConference() {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");
  const userId = token ? jwtDecode(token).id : null;
  const role = token ? jwtDecode(token).roles : null;

  useEffect(() => {

    hmsActions.join({
      userName: userId,
      authToken: token
    });
  }, [userId, role, hmsActions]);

  if (!isConnected) return <div>Joining class...</div>;

  return <div>You are in the class!</div>;
}

export default function VideoApi() {
  return (
    <HMSRoomProvider>
      <VideoConference/>
    </HMSRoomProvider>
  );
}
