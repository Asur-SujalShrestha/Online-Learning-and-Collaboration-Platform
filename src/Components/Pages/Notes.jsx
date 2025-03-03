import React, { useEffect, useState } from 'react';
import Header from './Header';
import LeftAside from './LeftAside';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import axios from 'axios';
import "../CSS/Notes.css";
import AddNotes from './AddNotes';
import { FaTrash } from "react-icons/fa";

function Notes() {
    const [userId, setUserId] = useState("");
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decode = jwtDecode(token);
                setUserId(decode.id);
            }
            catch (error) {
                toast.error("Failed to decode token");
            }
        }
    }, []);

    const fetchNote = async () => {
        const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
        const URL = `${import.meta.env.VITE_API_NOTES}/get-note/${userId}`;
        try {
            const response = await axios.get(URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(response.data);
        } catch (error) {
            toast.error("Error fetching notes");
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchNote();
    }, [userId]);

    const confirmDelete = (noteId) => {
        setSelectedNoteId(noteId);
        setDeleteModal(true);
    };

    const deleteNote = async () => {
        if (!selectedNoteId) return;

        const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
        const URL = `${import.meta.env.VITE_API_NOTES}/delete-note/${selectedNoteId}`;
        try {
            await axios.delete(URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Note deleted successfully");
            fetchNote(); // Refresh notes
        } catch (error) {
            toast.error("Failed to delete note");
        }
        setDeleteModal(false);
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
                        <h2 className='group-title'>Notes and Memos</h2>
                        <div className="notes-grid">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <div key={note.id} className="note-card">
                                        <FaTrash className="delete-icon" onClick={() => confirmDelete(note.id)} />
                                        <h3>{note.title}</h3>
                                        <p>{note.note}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No notes available</p>
                            )}
                        </div>
                    </div>
                </div>
                <button className="add-note-button" onClick={() => setShowModal(true)}>Add Note</button>
                {showModal && (
                    <AddNotes onClose={() => setShowModal(false)} userId={userId} onNoteAdded={fetchNote} />
                )}

                {/* Delete Confirmation Modal */}
                {deleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-containers">
                            <h3>Are you sure you want to delete this note?</h3>
                            <div className="button-group">
                                <button className="cancel-btn" onClick={() => setDeleteModal(false)}>Cancel</button>
                                <button className="delete-btn" onClick={deleteNote}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notes;
