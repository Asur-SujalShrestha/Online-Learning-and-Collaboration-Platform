import React, { useEffect, useState } from 'react';
import "../CSS/ProgramDetail.css";
import { HiOutlinePhoto } from "react-icons/hi2";
import { IoIosSend } from "react-icons/io";
import ProgramSideMenu from './ProgramSideMenu';
import { FaPlus } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import Header from './Header';
import { useParams } from 'react-router-dom';
import Assignment from './Assignment';
import toast from 'react-hot-toast';
import axios from 'axios';
import SubmittedAssignment from './SubmittedAssignment';
import TeacherContents from './TeacherContents';
import ProgramChat from './ProgramChat';

function ProgramDetail() {
    const { programId } = useParams();
    const [step, setStep] = useState("1");
    const [programDetail, setProgramDetail] = useState(null);
    const [assignmentDetail, setAssignmentDetail] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchProgram = async () => {
            const URL = `${import.meta.env.VITE_API_PROGRAM}/getPrograms/${programId}`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.length > 0) {
                    setProgramDetail(response.data[0]); // Set the first program
                } else {
                    toast.error("Program not found");
                }
            } catch (error) {
                toast.error(error.response?.data || "An error occurred");
            }
        };

        fetchProgram();
    }, [programId]);

    useEffect(() => {
        
    
        fetchAssignment();
    }, [programId, refresh]); 

    const fetchAssignment = async () => {
        const URL = `${import.meta.env.VITE_API_ASSIGNMENT}/get-assignment/${programId}`;
        const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');

        try {
            const response = await axios.get(URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.length > 0) {
                setAssignmentDetail(response.data);
            } else {
                toast.error("No assignments found");
            }
        } catch (error) {
            toast.error(error.response?.data || "An error occurred");
        }
    };

    const handleNewAssignment = () => {
        fetchAssignment();  // Re-fetch assignments when a new assignment is added
    };

    return (
        <>
            <div className="chat-container">
                <Header />
                <div style={{ display: "flex", flexDirection: "row", height: "89%" }}>
                    <div className="left-sidebar">
                        <ProgramSideMenu step={step} setStep={setStep} />
                    </div>

                    {step === "1" && <ProgramChat programId = {programId} programDetail={programDetail} />} 
                    {step === "2" && (
                        <TeacherContents programId = {programId} programDetail={programDetail} />
                    )}
                    {step === "3" && (
                        
                        <Assignment assignmentDetail={assignmentDetail} programDetail={programDetail} onNewAssignment={handleNewAssignment}/>
                    )}

                    {step === "4" &&(
                        <SubmittedAssignment programId={programId} programDetail={programDetail}/>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProgramDetail;
