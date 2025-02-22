import React, { useEffect, useState } from 'react'
import "../CSS/Program.css"
import Header from './Header'
import LeftAside from './LeftAside'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Program = () => {
    const [listProgram, setListProgram] = useState([]);
    const navigate = useNavigate();
    // List of background colors
    const colors = ["#FF5733", "#75975e", "#023E8A", "#C1006E", "#E0Bc00", "#00005A", "#004A50"];

    useEffect(() => {
        const fetchProgram = async () => {
            const URL = `${import.meta.env.VITE_API_PROGRAM}/getPrograms`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                setListProgram(response.data);
            }
            catch (error) {
                toast.error(error.response?.data || "An error occurred");
            }
        };

        fetchProgram();
    }, []);

    const handleProgramDetail=(programName)=>{
        navigate(`/programDetail/${programName}`);
    };

    return (
        <div>
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
                                {
                                    listProgram.map((program, index) => (
                                        <div 
                                            key={index} 
                                            className="group-card" 
                                            style={{ backgroundColor: colors[index % colors.length] }}
                                            onClick={()=>handleProgramDetail(program.name)}
                                        >
                                            <span className='title'>{program.name}</span>
                                            <span className='total-member'>Total member: {program.members.length}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Program
