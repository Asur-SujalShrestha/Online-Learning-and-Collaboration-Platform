import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const RoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchRooms();
    }, []);
  
    const fetchRooms = async () => {
        try {
          const response = await axios.get('https://192.168.101.3:8081/api/room-list');
          setRooms(response.data);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
  
    const createRoom = async () => {
        if (!newRoomName.trim() || !username.trim()) {
          return alert('Enter your name and room name');
        }
      
        try {
          const response = await axios.post('https://192.168.101.3:8081/api/rooms', {
            name: newRoomName,
          });
      
          if (response.status === 200) {
            const room = response.data;
            localStorage.setItem('username', username);
            navigate(`/videochat/${room.roomId}`);
          }
        } catch (error) {
          console.error('Error creating room:', error);
          alert('Failed to create room');
        }
      };
  
    return (
      <div className="rooms-container">
        <h2>Video Learning Rooms</h2>
        <div className="create-room-form">
          <input type="text" placeholder="Enter your display name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Enter room name" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
          <button onClick={createRoom}>Create New Room</button>
        </div>
        <div className="active-rooms">
          <h3>Active Rooms</h3>
          <div className="rooms-list">
            {rooms.map((room) => (
              <div key={room.roomId} className="room-card">
                <h4>{room.name}</h4>
                <p>Participants: {room.participants?.length || 0}</p>
                <p>ID: {room.roomId}</p>
                <button onClick={() => navigate(`/videochat/${room.roomId}`)}>Join Room</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default RoomsList;