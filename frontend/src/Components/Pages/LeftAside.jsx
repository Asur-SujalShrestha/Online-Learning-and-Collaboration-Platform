import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaSearch, FaEllipsisH } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { BiMessageRounded } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import '../CSS/LeftAside.css';

function LeftAside() {
    const [listUser, setListUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const URL = `${import.meta.env.VITE_API_USER}/all-user`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setListUser(response.data);
                setFilteredUsers(response.data);
            }
            catch (error) {
                navigate('/login');
                toast.error(error.response?.data || 'Failed to fetch users');
            }
        };

        fetchUser();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setFilteredUsers(listUser);
            return;
        }
        
        const filtered = listUser.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const toggleSearch = () => {
        setIsSearching(!isSearching);
        if (!isSearching) {
            setSearchTerm('');
            setFilteredUsers(listUser);
        }
    };

    const navigateToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const navigateToChat = (userId) => {
        navigate(`/chat/${userId}`);
    };

    return (
        <aside className="left-aside">
            <div className="aside-header">
                {isSearching ? (
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchTerm}
                            onChange={handleSearch}
                            autoFocus
                            className="search-input"
                        />
                        <button onClick={toggleSearch} className="close-search">
                            <IoMdClose />
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="aside-title">
                            <FaUserFriends className="title-icon" />
                            <span>Friends</span>
                        </h2>
                        <div className="header-actions">
                            <button onClick={toggleSearch} className="action-btn">
                                <FaSearch />
                            </button>
                            <button className="action-btn">
                                <BsThreeDotsVertical />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="friends-container">
                {filteredUsers.length > 0 ? (
                    <ul className="friends-list">
                        {filteredUsers.map((user) => (
                            <li 
                                key={user.id} 
                                className={`friend-item ${activeUser === user.id ? 'active' : ''}`}
                                onClick={() => setActiveUser(user.id)}
                                onDoubleClick={() => navigateToProfile(user.id)}
                            >
                                <div className="friend-avatar">
                                    {user.profilePic && user.profilePic !== "none" && user.profilePic !== "null" ? (
                                        <img 
                                            src={user.profilePic} 
                                            alt={`${user.firstName} ${user.lastName}`} 
                                            className="avatar-image"
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </div>
                                    )}
                                    <span className="online-status"></span>
                                </div>
                                <div className="friend-info">
                                    <h3 className="friend-name">{user.firstName} {user.lastName}</h3>
                                    <p className="friend-status">Online</p>
                                </div>
                                <div className="friend-actions">
                                    <button 
                                        className="message-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToChat(user.id);
                                        }}
                                    >
                                        <BiMessageRounded />
                                    </button>
                                    <button className="menu-btn">
                                        <FaEllipsisH />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-friends">
                        {searchTerm ? (
                            <>
                                <p>No friends found for "{searchTerm}"</p>
                                <button 
                                    className="clear-search"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilteredUsers(listUser);
                                    }}
                                >
                                    Clear search
                                </button>
                            </>
                        ) : (
                            <p>No friends available</p>
                        )}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default LeftAside;