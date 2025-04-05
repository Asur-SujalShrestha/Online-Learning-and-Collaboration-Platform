// src/webrtc-utils.js
export const createPeerConnection = (localStream, onTrack, onICECandidate) => {
    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    console.log("PeerConnection created:", peerConnection);

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
        console.log("Added local track:", track);
    });

    peerConnection.ontrack = (event) => {
        console.log("Received remote track event:", event);
        onTrack(event.streams[0]);  // Call the onTrack callback with the remote stream
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate && onICECandidate) {
            onICECandidate(event.candidate);
        }
    };

    return peerConnection;
};




export const createOffer = async (peerConnection) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
};

export const createAnswer = async (peerConnection, offer) => {
    console.log("Setting remote description with offer:", offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log("Created and set local answer:", answer);
    return answer;
};


export const addAnswer = async (peerConnection, answer) => {
    await peerConnection.setRemoteDescription(answer);
};

export const addIceCandidate = async (peerConnection, candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};
