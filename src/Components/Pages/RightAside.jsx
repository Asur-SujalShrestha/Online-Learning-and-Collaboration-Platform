import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaSearch, FaPlus, FaEllipsisH } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import '../CSS/RightAside.css';

function RightAside() {
    const [listProgram, setListProgram] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [activeProgram, setActiveProgram] = useState(null);

    useEffect(() => {
        const fetchProgram = async () => {
            const URL = `${import.meta.env.VITE_API_PROGRAM}/getPrograms`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setListProgram(response.data);
                setFilteredPrograms(response.data);
            }
            catch (error) {
                toast.error(error.response?.data || "Failed to fetch programs");
            }
        };

        fetchProgram();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setFilteredPrograms(listProgram);
            return;
        }
        
        const filtered = listProgram.filter(program => 
            program.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPrograms(filtered);
    };

    const toggleSearch = () => {
        setIsSearching(!isSearching);
        if (!isSearching) {
            setSearchTerm('');
            setFilteredPrograms(listProgram);
        }
    };

    const navigateToProgram = (programId) => {
        // Implement navigation to program details
        console.log(`Navigate to program ${programId}`);
    };

    return (
        <aside className="right-aside">
            <div className="aside-header">
                {isSearching ? (
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search programs..."
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
                            <FaCalendarAlt className="title-icon" />
                            <span>Programs</span>
                        </h2>
                        <div className="header-actions">
                            <button onClick={toggleSearch} className="action-btn">
                                <FaSearch />
                            </button>
                            
                        </div>
                    </>
                )}
            </div>

            <div className="right-programs-container">
                {filteredPrograms.length > 0 ? (
                    <ul className="programs-list">
                        {filteredPrograms.map((program) => (
                            <li 
                                key={program.id} 
                                className={`program-item ${activeProgram === program.id ? 'active' : ''}`}
                                onClick={() => setActiveProgram(program.id)}
                                onDoubleClick={() => navigateToProgram(program.id)}
                            >
                                <div className="program-icon">
                                    <FaCalendarAlt />
                                </div>
                                <div className="program-info">
                                    <h3 className="right-program-name">{program.name}</h3>
                                    <p className="program-details">
                                        {program.courseCount || 0} courses • {program.userCount || 0} members
                                    </p>
                                </div>
                                <div className="program-actions">
                                    <button className="menu-btn">
                                        <FaEllipsisH />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-programs">
                        {searchTerm ? (
                            <>
                                <p>No programs found for "{searchTerm}"</p>
                                <button 
                                    className="clear-search"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilteredPrograms(listProgram);
                                    }}
                                >
                                    Clear search
                                </button>
                            </>
                        ) : (
                            <p>No programs available</p>
                        )}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default RightAside;