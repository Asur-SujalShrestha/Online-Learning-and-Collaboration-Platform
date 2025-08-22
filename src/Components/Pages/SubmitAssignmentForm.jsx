import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import "../CSS/SubmitAssignmentForm.css"
import toast from 'react-hot-toast';

function SubmitAssignmentForm({ assignmentId, userId, onClose, selectedAssignmentTitle, programId }) {
    useEffect(()=>{
        console.log(selectedAssignmentTitle);
        console.log(`THis is program Id: ${programId}`);
    })
    const [formData, setFormData] = useState({
        description: '',
        files: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (index, e) => {
        const newFiles = [...formData.files];
        newFiles[index] = e.target.files[0];
        setFormData({ ...formData, files: newFiles });
    };

    const addFileInput = () => {
        setFormData({ ...formData, files: [...formData.files, null] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        submissionData.append("submittedAssignment", new Blob([JSON.stringify({
            assignmentId,
            userId,
            programId,
            description: formData.description,
            uploadedDate: new Date(),
            review: null, 
            grade: null    
        })], { type: "application/json" }));
    
        formData.files.forEach(file => {
            if (file) submissionData.append("file", file);
        });
    
        try {
            const URL = `${import.meta.env.VITE_API_SUBMITTED_ASSIGNMENT}/add-submitted-assignment`
            const response = await axios.post(URL, submissionData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success(response.data);
            onClose();
        } catch (error) {
            console.error("Error submitting assignment:", error);
            toast.error(error.response.data);
        }
    };
    

    return (
        <div className="overlay">
            <div className="form-container">
                <h2>Submit Assignment</h2>
                <h3>{selectedAssignmentTitle}</h3>
                <form onSubmit={handleSubmit}>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />

                    <label>Attachments:</label>
                    {formData.files.map((file, index) => (
                        <div key={index} className="file-upload-container">
                            <input
                                type="file"
                                id={`file-input-${index}`}
                                onChange={(e) => handleFileChange(index, e)}
                                style={{ display: "none" }}
                            />
                            <label htmlFor={`file-input-${index}`} className="file-upload">
                                {file ? file.name : "Choose file..."}
                            </label>
                        </div>
                    ))}
                    <div>
                        <button type="button" onClick={addFileInput} className="add-file-btns">
                            <FaPlus /> Add Files
                        </button>
                    </div>


                    <div className="button-groups">
                        <button type="submit" className="submit-btn">Submit</button>
                        <button type="button" onClick={onClose} className="close-btns">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmitAssignmentForm;
