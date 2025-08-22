import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

function TeacherContentForm({ userId, programId, onClose, refreshContent }) {
    const [formData, setFormData] = useState({
        title: '',
        files: []
    });

    const handleFileChange = (index, event) => {
        const newFiles = [...formData.files];
        newFiles[index] = event.target.files[0];
        setFormData({ ...formData, files: newFiles });
    };

    const addFileInput = () => {
        setFormData({ ...formData, files: [...formData.files, null] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('teacherContent', new Blob([JSON.stringify({
            title: formData.title,
            uploadedBy: userId,
            programId: programId
        })], { type: 'application/json' }));
        
        formData.files.forEach((file) => {
            if (file) {
                formDataToSend.append('file', file);
            }
        });

        try {
            await axios.post(`${import.meta.env.VITE_API_TEACHER_CONTENT}/add-content`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Content added successfully');
            onClose();
            refreshContent();
        } catch (error) {
            console.error('Error adding content:', error);
            toast.error('Failed to add content');
        }
    };

    return (
        <div className="overlay">
            <div className="form-container">
                <h2>Add Teacher Content</h2>
                <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <textarea
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <label>Attachments:</label>
                    {formData.files.map((file, index) => (
                        <div key={index} className="file-upload-container">
                            <input
                                type="file"
                                id={`file-input-${index}`}
                                onChange={(e) => handleFileChange(index, e)}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor={`file-input-${index}`} className="file-upload">
                                {file ? file.name : 'Choose file...'}
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

export default TeacherContentForm;