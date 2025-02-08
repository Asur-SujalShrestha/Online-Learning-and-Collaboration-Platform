import React from 'react';
import "../CSS/LeftAside.css"

function LeftAside() {
    return (
        <div>
            <div className="sidebar left-sidebar">
                <h2 className="subtitle">Friends</h2>
                <ul className="friends-list">
                    {[
                        "Sujal Shrestha",
                        "Namita Shrestha",
                        "Pragati Chhetri",
                        "Manoj Poudel",
                        "Sujal Shrestha",
                    ].map((name, index) => (
                        <li key={index} className="friend-item">
                            <div className="avatar"></div>
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default LeftAside
