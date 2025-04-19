import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

function RightAside() {
    const [listProgram, setListProgram] = useState([]);
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
    return (
        <div>
            <div className="sidebar right-sidebar">
                <div>
                <h2 className="subtitles">Programs</h2>
                <ul className="groups-list">
                    {
                        listProgram.map((program, index)=>(
                            <li className="group-item" key={index}>
                                <div className="avatar"></div>{program.name}
                            </li>
                        ))
                    }
                    
                </ul>
                </div>
            </div>
        </div>
    )
}

export default RightAside
