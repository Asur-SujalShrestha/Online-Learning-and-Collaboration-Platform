import React, { useEffect, useState } from "react";
import "../CSS/Planning.css";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import LeftAside from "./LeftAside";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const columns = ["TODO", "IN_PROGRESS", "DONE"];

export default function Planning() {
    const [tickets, setTickets] = useState({
        TODO: [],
        IN_PROGRESS: [],
        DONE: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({ title: "", description: "" });

    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        fetch(`https://192.168.101.3:8081/collapp/planning/get-plan/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                const grouped = {
                    TODO: [],
                    IN_PROGRESS: [],
                    DONE: [],
                };
                data.forEach((ticket) => grouped[ticket.status].push(ticket));
                setTickets(grouped);
            });
    }, []);

    const handleDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const ticket = tickets[source.droppableId].find(
            (t) => t.id.toString() === draggableId
        );

        const updatedTickets = { ...tickets };
        updatedTickets[source.droppableId] = updatedTickets[source.droppableId].filter(
            (t) => t.id.toString() !== draggableId
        );
        ticket.status = destination.droppableId;
        updatedTickets[destination.droppableId].push(ticket);
        setTickets(updatedTickets);

        fetch(`https://192.168.101.3:8081/collapp/planning/${draggableId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
        });
    };

    const handleCreateTicket = (e) => {
        e.preventDefault();

        const ticket = {
            ...newTicket,
            userId,
        };

        fetch("https://192.168.101.3:8081/collapp/planning/add-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticket),
        })
            .then((res) => res.json())
            .then((savedTicket) => {
                setTickets((prev) => ({
                    ...prev,
                    TODO: [...prev.TODO, savedTicket],
                }));
                setNewTicket({ title: "", description: "" });
                setShowModal(false);
            });
    };

    const deleteTicket = (planId) => {
        fetch(`https://192.168.101.3:8081/collapp/planning/delete-plan/${planId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete ticket");
            }
            setTickets((prev) => {
              const updated = { ...prev };
              for (const status in updated) {
                updated[status] = updated[status].filter(ticket => ticket.id !== planId);
              }
              return updated;
            });
          })
          .catch((err) => {
            console.error("Error deleting ticket:", err);
          });
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


                <div className="board-container">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {columns.map((status) => (
                            <Droppable droppableId={status} key={status}>
                                {(provided) => (
                                    <div
                                        className="board-column"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h2 className="board-title">{status.replace("_", " ")}</h2>

                                        {status === "TODO" && (
                                            <button className="add-btn" onClick={() => setShowModal(true)}>
                                                + Add
                                            </button>
                                        )}

                                        {tickets[status].map((ticket, index) => (
                                            <Draggable
                                                key={ticket.id}
                                                draggableId={ticket.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="ticket"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div>
                                                            <p className="ticket-title">{ticket.title}</p>
                                                            <p className="ticket-description">{ticket.description}</p>
                                                        </div>

                                                        <MdDelete onClick={()=> deleteTicket(ticket.id)} className="delete-ticket"/>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>

                    {/* Modal */}
                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Create New Ticket</h3>
                                <form onSubmit={handleCreateTicket}>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        value={newTicket.title}
                                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Description"
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                        required
                                    />
                                    <button className="ticketSubmit" type="submit">Add</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="cancel-btns">
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
