import React, { useEffect, useState } from 'react';
import "../CSS/Program.css";
import Header from './Header';
import LeftAside from './LeftAside';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Program = () => {
    const [listProgram, setListProgram] = useState([]);
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    const colors = ["#FF5733", "#75975e", "#023E8A", "#C1006E", "#E0Bc00", "#00005A", "#004A50"];

    useEffect(() => {
        const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchProgram = async () => {
            const URL = `${import.meta.env.VITE_API_PROGRAM}/getPrograms-userId/${userId}`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setListProgram(response.data);
            } catch (error) {
                toast.error(error.response?.data || "An error occurred");
            }
        };

        fetchProgram();
    }, [userId]);

    const handleProgramDetail = (programId) => {
        navigate(`/programDetail/${programId}`);
    };

    return (
        <div className='main-container'>
            <div className='header-section'>
                <Header />
            </div>

            <div className='container'>
                <div className='left-section'>
                    <LeftAside />
                </div>

                <div className="group-container">
                    <div className='groups-section'>
                        <h2 className='group-title'>Programs</h2>
                        <div className="groups-container">
                            {listProgram.map((program) => (
                                <div 
                                    key={program.id} 
                                    className="group-card" 
                                    style={{ backgroundColor: colors[program.id % colors.length] }}
                                    onClick={() => handleProgramDetail(program.id)}
                                >
                                    <span className='title'>{program.name}</span>
                                    <span className='total-member'>Total members: {program.members?.length || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Program;
