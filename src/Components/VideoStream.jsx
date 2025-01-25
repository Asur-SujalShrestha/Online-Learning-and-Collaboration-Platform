import React, { useRef, useEffect, useState } from "react";
import SimplePeer from "simple-peer";

const VideoStream = () => {
    const [stream, setStream] = useState(null);
    const videoRef = useRef();
    const peerRef = useRef();
    const ws = useRef(new WebSocket("ws://localhost:8081/stream"));

    useEffect(() => {
        // Access user's camera
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;

            // WebSocket message handling
            ws.current.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.signal) {
                    peerRef.current.signal(data.signal);
                }
            };

            // Create a new peer connection
            const peer = new SimplePeer({ initiator: true, trickle: false, stream: mediaStream });

            peer.on("signal", (signal) => {
                ws.current.send(JSON.stringify({ signal }));
            });

            peer.on("stream", (remoteStream) => {
                if (videoRef.current) videoRef.current.srcObject = remoteStream;
            });

            peerRef.current = peer;
        });

        return () => {
            ws.current.close();
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return <video ref={videoRef} autoPlay muted />;
};

export default VideoStream;
