import React, { useState } from "react";
import "../CSS/Assignment.css"; // External CSS file
import axios from "axios";

const AssignmentForm = ({ onClose }) => {
    const [imageName, setImageName] = useState("Choose Image...")

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageName(file.name);
        SetImageUpload(file);
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            toast.error("File size exceeds 10MB limit")
            return;
        }
        console.log(file)
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        uploadedDate: "",
        dueDate: "",
        files: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, files: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append(
            "AssignmentDetail",
            new Blob([JSON.stringify(formData)], { type: "application/json" })
        );
        for (let i = 0; i < formData.files.length; i++) {
            data.append("files", formData.files[i]);
        }

        try {
            const response = await axios.post("http://localhost:8081/collapp/assignment/add-assignment", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Assignment added successfully");
            onClose();
        } catch (error) {
            alert("Error adding assignment");
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

                    <label>Upload Date:</label>
                    <input type="date" name="uploadedDate" value={formData.uploadedDate} onChange={handleChange} required />

                    <label>Due Date:</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />

                    <label htmlFor="uploadImage" className='file-upload'>
                        <input multiple style={{display:"none"}} type="file" id="uploadImage" onChange={handleImageChange} />
                        <div >{imageName}</div>

                    </label>

                    <button type="submit" className="submit-btns">Submit</button>
                    <button type="button" onClick={onClose} className="close-btn">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AssignmentForm;
