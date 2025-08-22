import React, { useState } from "react";
import "../CSS/Assignment.css"; // External CSS file
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa"; // Import plus icon

const AssignmentForm = ({ onClose, id, userId, onNewAssignment }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        uploadedDate: new Date().toISOString().split("T")[0],
        dueDate: "",
        files: [],
        programId: id,
        userId: userId
    });

    // Handle text inputs (title, description, dueDate)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file selection
    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB limit
        if (file.size > maxSize) {
            toast.error("File size exceeds 10MB limit");
            return;
        }

        const files = [...formData.files];
        files[index] = file; // Assign selected file at index
        setFormData({ ...formData, files });
    };

    // Add a new file input dynamically
    const addFileInput = () => {
        setFormData({ ...formData, files: [...formData.files, null] });
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append(
            "AssignmentDetail",
            new Blob([JSON.stringify(formData)], { type: "application/json" })
        );

        formData.files.forEach((file) => {
            if (file) data.append("files", file);
        });

        try {
            const URL = `${import.meta.env.VITE_API_ASSIGNMENT}/add-assignment`;
            await axios.post(URL, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onNewAssignment();
            toast.success("Assignment added successfully");
            onClose();
        } catch (error) {
            toast.error("Error adding assignment");
            console.error(error);
        }
    };

    return (
        <div className="overlay">
            <div className="form-container">
                <h2>Add Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />

                    <label>Due Date:</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />

                    <label>Attachments:</label>
                    {formData.files.map((file, index) => (
                        <div key={index} className="file-upload-container">
                            <input 
                                type="file"
                                id={`file-input-${index}`} // Unique ID for each input
                                onChange={(e) => handleFileChange(index, e)}
                                style={{ display: "none" }}
                            />
                            <label htmlFor={`file-input-${index}`} className="file-upload">
                                {file ? file.name : "Choose file..."}
                            </label>
                        </div>
                    ))}

                    {/* Add More Files Button */}
                    <button type="button" onClick={addFileInput} className="add-file-btn">
                        <FaPlus /> Add More Files
                    </button>

                    <button type="submit" className="submit-btns">Submit</button>
                    <button type="button" onClick={onClose} className="close-btn">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AssignmentForm;
