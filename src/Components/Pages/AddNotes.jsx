import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import "../CSS/AddNotes.css";

function AddNotes({ onClose, userId, onNoteAdded }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSave = async () => {
        if (!title || !content) {
            toast.error("Title and content cannot be empty.");
            return;
        }

        const noteData = {
            title: title,
            note: content, // Match DTO field "note"
            date: new Date(), // Set current date
            userId: userId
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_NOTES}/add-note`, noteData);
            toast.success("Note added successfully!");
            onNoteAdded(); // Refresh the notes list
            onClose(); // Close modal after saving
        } catch (error) {
            toast.error(error.response?.data || "Failed to add note.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <input
                    type="text"
                    placeholder="Title of Note"
                    className="note-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Add items..."
                    className="note-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="button-group">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddNotes;
