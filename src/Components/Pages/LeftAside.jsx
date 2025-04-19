import React, { useEffect, useState } from 'react';
import "../CSS/LeftAside.css"
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function LeftAside() {
    const [listUser, setListUser] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            const URL = `${import.meta.env.VITE_API_USER}/all-user`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                console.log(response.data)
                setListUser(response.data);
            }
            catch (error) {
                navigate('/login');
                toast.error(error.response.data);
                
            }
        };

        fetchUser();
    }, []);
    return (
        <div className="leftside-sidebar left-sidebars">
            <h2 className="subtitles">Friends</h2>
            <ul className="friends-list">
                {listUser.map((user) => (
                    <li key={user.id} className="friend-item">
                        <div className="avatar">
                            {user.profilePic && user.profilePic !== "none" && user.profilePic !== "null" ? (
                                <img src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                            ) : (
                                <div className="avatar-placeholder"></div>
                            )}
                        </div>
                        <span>{user.firstName} {user.lastName}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LeftAside
