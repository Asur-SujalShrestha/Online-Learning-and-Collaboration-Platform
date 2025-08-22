import React from 'react';
import { User } from 'react-feather';

const ParticipantsList = ({ participants }) => (
    <div className="participants-panel">
      <h3>Participants ({participants.length + 1})</h3>
      <ul className="participants-list">
        <li className="participant-item you">
          <User className="participant-icon" />
          <span className="participant-name">You</span>
          <span className="participant-badge host">Host</span>
        </li>
        {participants.map((participant) => (
          <li key={participant.id} className="participant-item">
            <User className="participant-icon" />
            <span className="participant-name">{participant.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
export default ParticipantsList;