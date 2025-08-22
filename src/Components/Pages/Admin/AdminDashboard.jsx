import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSideBar";
import AdminUsers from "./Users";
import AdminProgram from "./Programs";
import AdminAssignments from "./Assignments";
import "../../CSS/Admin.css";
import axios from "axios";
import { Card, CardContent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "../../CSS/Admin/Dashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [assignments, setAssignments] = useState([]);


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_USER}/all-user`)
      .then(res => setUsers(res.data))
      .catch(err => console.error("User API Error:", err));

    axios.get(`${import.meta.env.VITE_API_PROGRAM}/getPrograms`)
      .then(res => setPrograms(res.data))
      .catch(err => console.error("Program API Error:", err));

    axios.get(`${import.meta.env.VITE_API_ORGANIZATION}/get-all-organization`)
      .then(res => setOrganizations(res.data))
      .catch(err => console.error("Org API Error:", err));

    axios.get(`${import.meta.env.VITE_API_ASSIGNMENT}/add-assignment`)
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Assignment API Error:", err));
  }, []);

  const organizationData = organizations.map(org => ({
    name: org.organizationName,
    status: org.status === "ACTIVE" ? 1 : 0
  }));

  const assignmentData = assignments.map(a => ({
    title: a.title,
    user: `${a.user.firstName} ${a.user.lastName}`
  }));

  const userRoles = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const userRoleData = Object.entries(userRoles).map(([role, count]) => ({
    name: role,
    value: count
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div className="dashboard">
      <AdminSidebar setActiveTab={setActiveTab} />
      <div className="content">
        {activeTab === "Users" && <AdminUsers/>}
        {activeTab === "Program" && <AdminProgram />}
        {activeTab === "Assignments" && <AdminAssignments />}

        {activeTab === "Dashboard" && (
          <div className="admin-dashboard">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="card-grid">
            <Card className="dashboard-card">
              <CardContent>
                <h2>Total Users</h2>
                <p>{users.length}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardContent>
                <h2>Total Programs</h2>
                <p>{programs.length}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardContent>
                <h2>Total Organizations</h2>
                <p>{organizations.length}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardContent>
                <h2>Total Assignments</h2>
                <p>{assignments.length}</p>
              </CardContent>
            </Card>
          </div>
    
          <div className="chart-section">
            <h2>Organization Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={organizationData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="status" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
