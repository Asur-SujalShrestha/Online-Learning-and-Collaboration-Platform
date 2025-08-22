import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFileAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5"; // Back icon

function TeacherContentDetail({ contentId, setStep }) {
    const [contentDetail, setContentDetail] = useState(null);

    useEffect(() => {
        console.log(`This is content Id: ${contentId}`);
        const fetchContentDetail = async () => {
            const URL = `${import.meta.env.VITE_API_TEACHER_CONTENT}/get-content/${contentId}`;
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
            try {
                const response = await axios.get(URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setContentDetail(response.data);
            } catch (error) {
                toast.error(error.response.data);
            }
        };

        fetchContentDetail();
    }, []);

    return (
        <div className="assignments-container">
            {/* Back Button */}
            <button className="back-buttons" onClick={() => setStep("1")}>
                <IoArrowBack style={{ fontSize: "28px", marginRight: "5px" }} /> 
            </button>

            {contentDetail?.length > 0 ? (
                <div className="assignments-list">
                    {contentDetail.map((content, index) => (
                        <div key={index} className="assignment-card">
                            <div className="assignment-headers">
                                <FaRegFileAlt style={{ fontSize: "30px" }} />
                                <h3>{content.fileUrl}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No contents available.</p>
            )}
        </div>
    );
}

export default TeacherContentDetail;
