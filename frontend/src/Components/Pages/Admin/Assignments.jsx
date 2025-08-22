import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/Admin/Assignment.css";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const AdminAssignments = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
  const organizationId = token ? jwtDecode(token).organization : null;

  useEffect(() => {
    if (organizationId) fetchPrograms();
  }, [organizationId]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_PROGRAM}/get-program-organization/${organizationId}`);
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchAssignments = async (programId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_ASSIGNMENT}/get-assignment/${programId}`);
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };
  const fetchSubmittedAssignments = async (assignmentId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SUBMITTED_ASSIGNMENT}/${assignmentId}`);
      setSubmittedAssignments(response.data);
    } catch (error) {
      console.error("Error fetching submitted assignments:", error);
    }
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmittedAssignments(assignment.id);
  };

  const handleSubmittedBackClick = () => {
    if (selectedAssignment) {
      setSelectedAssignment(null);
      setSubmittedAssignments([]);
    } else if (selectedProgram) {
      setSelectedProgram(null);
      setAssignments([]);
    }
  };


  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    fetchAssignments(program.id);
  };

  const handleBackClick = () => {
    setSelectedProgram(null);
    setAssignments([]);
    setFilterText("");
  };

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const getDownloadableUrl = (fileUrl) => {
    return fileUrl.replace("/upload/", "/upload/fl_attachment/");
  };

  return (
    <div className="programs-container">
      <div className="page-header">
        <h2>Assignments Management</h2>
      </div>

      {!selectedProgram ? (
        <div className="program-list">
          {programs.map((program) => (
            <div
              className="program-card clickable"
              key={program.id}
              onClick={() => handleProgramClick(program)}
            >
              <div className="program-header">
                <div className="program-name">{program.name}</div>
              </div>
              <div className="members">
                {program.members.length === 0 ? (
                  <p className="no-members">No members</p>
                ) : (
                  <p className="no-members">{program.members.length} Members</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : selectedProgram && !selectedAssignment ? (
        <div className="assignments-section">
          <button className="assignment-back-button" onClick={handleBackClick}>← Back</button>

          <div className="assignment-title-div">
            <h3 className="selected-program-title">Program: {selectedProgram.name}</h3>

            <div className="filter-box">
              <input
                type="text"
                placeholder="Filter by assignment title..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="assignments-list">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <div key={index} onClick={() => handleAssignmentClick(assignment)} className="assignment-card">
                  <div className="assignment-header">
                    <h3 style={{ margin: "0 0 20px 0" }}>{assignment.title}</h3>
                    <div>
                      <span className="publish-date">📅 Publish at: {new Date(assignment.uploadedDate).toLocaleDateString()}</span>
                      <span className="due-date">📆 Due date: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="assignment-description">{assignment.description}</p>
                  <div className='assignment-file'>
                    <div style={{ display: "flex", gap: "20px" }}>
                      {assignment.assignmentFiles.length > 0 ? (
                        assignment.assignmentFiles.map((file, index) => {
                          const fileName = file.fileUrl.split('/').pop();
                          return (
                            <div key={index} className="attachment">
                              <a style={{ color: "black", textDecoration: "none" }} href={getDownloadableUrl(file.fileUrl)} download target="_blank" rel="noopener noreferrer">
                                {fileName}
                              </a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="attachment">No attachments</div>
                      )}
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p>No assignments found for this program.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="submitted-assignments">
          <button className="back-button" onClick={handleSubmittedBackClick}>← Back</button>
          <h3>Submitted Assignments for: {selectedAssignment.title}</h3>
          {submittedAssignments.length > 0 ? (
            submittedAssignments.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submitted-by">
                  <img src={submission.user.profilePic} alt="User" width="40" height="40" style={{ borderRadius: '50%', objectFit:"cover" }} />
                  <span style={{ marginLeft: '10px' }}>{submission.user.firstName} {submission.user.lastName}</span>
                </div>
                <p><strong>Submitted On:</strong> {new Date(submission.date).toLocaleString()}</p>
                {submission.description && (
                  <p><strong>Description:</strong> {submission.description}</p>
                )}
                <div className="submitted-files">
                  {submission.submittedAssignmentFiles.map(file => (
                    <a key={file.id} href={file.fileUrl} target="_blank" rel="noopener noreferrer">📄 View Submission</a>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No submissions for this assignment.</p>
          )}
        </div>

      )}
    </div>
  );
};

export default AdminAssignments;
