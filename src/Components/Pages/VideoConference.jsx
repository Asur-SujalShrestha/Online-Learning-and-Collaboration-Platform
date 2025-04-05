import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import "../Services/WebRTCService";

const VideoChat = () => {
    const [stompClient, setStompClient] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerConnection = useRef(null);

    useEffect(() => {
        const socket = new SockJS('https://localhost:8081/ws/video');
        const client = Stomp.over(socket);

        client.connect({}, onConnect, onError);
        setStompClient(client);

        initializeMediaStream();

        return () => {
            if (client) client.disconnect();
            if (peerConnection.current) peerConnection.current.close();
            stopMediaTracks();
        };
    }, []);

    const onConnect = () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe('/topic/signaling', (message) => {
            const signal = JSON.parse(message.body);
            handleSignaling(signal);
        });
    };

    const onError = (error) => {
        console.error('WebSocket connection failed:', error);
    };

    const initializeMediaStream = async () => {
        const constraints = { video: true, audio: true };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            showDefaultScreen();
        }
    };

    const startCall = async () => {
        try {
            peerConnection.current = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            if (localStream) {
                localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));
            } else {
                console.warn('Local stream not available, sending no-video signal.');
                stompClient.send('/collapp/signal', {}, JSON.stringify({ type: 'no-video' }));
            }

            peerConnection.current.ontrack = (event) => {
                const [stream] = event.streams;
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
            };

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    stompClient.send('/collapp/signal', {}, JSON.stringify({ type: 'candidate', data: event.candidate }));
                }
            };

            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            stompClient.send('/app/signal', {}, JSON.stringify({ type: 'offer', data: offer }));
        } catch (error) {
            console.error('Error during startCall:', error);
        }
    };

    const handleSignaling = async (signal) => {
        switch (signal.type) {
            case 'offer':
                await handleOffer(signal);
                break;
            case 'answer':
                await handleAnswer(signal);
                break;
            case 'candidate':
                await handleCandidate(signal);
                break;
            case 'no-video':
                showNoVideoPlaceholder();
                break;
            default:
                console.warn('Unknown signal type:', signal.type);
        }
    };

    const handleOffer = async (signal) => {
        try {
            peerConnection.current = new RTCPeerConnection();
            peerConnection.current.ontrack = (event) => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            stompClient.send('/app/signal', {}, JSON.stringify({ type: 'answer', data: answer }));
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    };

    const handleAnswer = async (signal) => {
        try {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data));
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    };

    const handleCandidate = async (signal) => {
        try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.data));
        } catch (error) {
            console.error('Error handling candidate:', error);
        }
    };

    const stopMediaTracks = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
    };

    const showNoVideoPlaceholder = () => {
        if (remoteVideoRef.current) {
            // remoteVideoRef.current.srcObject = null;
            // remoteVideoRef.current.poster = 'src/assets/images.png'; // Dynamic placeholder
        }
    };

    const showDefaultScreen = () => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
            localVideoRef.current.poster = 'src/assets/images.png'; // Local default screen
        }
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay playsInline style={{ width: '300px' }} poster="src/assets/images.png" />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '600px' }} poster="src/assets/images.png" />
            <button onClick={startCall}>Start Call</button>
        </div>
    );
};

export default VideoChat;
