import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "./SuperAdminSideBar";
import SuperAdminUsers from "./SuperAdminUser";
import SuperAdminPrograms from "./SuperAdminProgram";
import SuperAdminAssignments from "./SuperAdminAssignment";
import Organizations from "./Organizations";
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../../CSS/SuperAdmin/Dashboard.css';

Chart.register(...registerables);


const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, programsRes, orgsRes, assignmentsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/users/all-user`),
          fetch(`${import.meta.env.VITE_API_BASE}/program/getPrograms`),
          fetch(`${import.meta.env.VITE_API_BASE}/organization/get-all-organization`),
          fetch(`${import.meta.env.VITE_API_BASE}/assignment/get-all-assignment`)
        ]);

        const usersData = await usersRes.json();
        const programsData = await programsRes.json();
        const orgsData = await orgsRes.json();
        const assignmentsData = await assignmentsRes.json();

        setUsers(usersData);
        setPrograms(programsData);
        setOrganizations(orgsData);
        setAssignments(assignmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // User Statistics
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const userChartData = {
    labels: Object.keys(roleCounts),
    datasets: [{
      label: 'Users by Role',
      data: Object.values(roleCounts),
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1
    }]
  };

  // Program Statistics
  const programChartData = {
    labels: programs.map(program => program.name),
    datasets: [{
      data: programs.map(program => program.members.length),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  };

  // Organization Statistics
  const orgStatusCounts = organizations.reduce((acc, org) => {
    acc[org.status] = (acc[org.status] || 0) + 1;
    return acc;
  }, {});

  const orgChartData = {
    labels: Object.keys(orgStatusCounts),
    datasets: [{
      data: Object.values(orgStatusCounts),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1
    }]
  };

  // Assignment Statistics
  const monthlyCounts = assignments.reduce((acc, assignment) => {
    const month = format(new Date(assignment.uploadedDate), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyCounts).sort((a, b) =>
    new Date(a) - new Date(b)
  );

  const assignmentChartData = {
    labels: sortedMonths,
    datasets: [{
      label: 'Assignments Uploaded',
      data: sortedMonths.map(month => monthlyCounts[month]),
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1
    }]
  };

  // Recent Users (sorted by ID as proxy for recent)
  const recentUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 5);

  // Recent Assignments
  const recentAssignments = [...assignments].sort((a, b) =>
    new Date(b.uploadedDate) - new Date(a.uploadedDate)
  ).slice(0, 5);


  

  return (
    <div className="dashboard">
      <SuperAdminSidebar setActiveTab={setActiveTab} />
      <div className="content">

        {activeTab === "Users" && <SuperAdminUsers />}
        {activeTab === "Program" && <SuperAdminPrograms />}
        {activeTab === "Assignments" && <SuperAdminAssignments />}
        {activeTab === "Organizations" && <Organizations />}


        {activeTab === "Dashboard" && (<div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <div className="header-actions">
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Data
              </button>
            </div>
          </header>

          {/* Stats Cards Grid */}
          <div className="stats-grid">
            {/* Users Card */}
            <div className="stats-card">
              <div className="card-header">
                <h3>User Statistics</h3>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <Bar
                    data={userChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'top' } }
                    }}
                  />
                </div>
                <div className="stats-summary">
                  <p>Total Users: <strong>{users.length}</strong></p>
                  <p>Admins: <strong>{roleCounts.Admin || 0}</strong></p>
                  <p>Teachers: <strong>{roleCounts.Teacher || 0}</strong></p>
                  <p>Students: <strong>{roleCounts.Student || 0}</strong></p>
                </div>
              </div>
            </div>

            {/* Programs Card */}
            <div className="stats-card">
              <div className="card-header">
                <h3>Program Statistics</h3>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <Pie
                  width={"625"}
                    data={programChartData}
                    
                    options={{
                      plugins: { legend: { position: 'right' } }
                    }}
                  />
                </div>
                <div className="stats-summary">
                  <p>Total Programs: <strong>{programs.length}</strong></p>
                  <p>Most Popular: <strong>{
                    programs.reduce((max, program) =>
                      program.members.length > max.members.length ? program : max,
                      programs[0])?.name
                  }</strong></p>
                </div>
              </div>
            </div>

            {/* Organizations Card */}
            <div className="stats-card">
              <div className="card-header">
                <h3>Organization Statistics</h3>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <Doughnut
                    data={orgChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'right' } }
                    }}
                  />
                </div>
                <div className="stats-summary">
                  <p>Total Organizations: <strong>{organizations.length}</strong></p>
                  <p>Active: <strong>{orgStatusCounts.ACTIVE || 0}</strong></p>
                  <p>Pending: <strong>{orgStatusCounts.PENDING || 0}</strong></p>
                </div>
              </div>
            </div>

            {/* Assignments Card */}
            <div className="stats-card">
              <div className="card-header">
                <h3>Assignment Statistics</h3>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <Line
                    data={assignmentChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'top' } }
                    }}
                  />
                </div>
                <div className="stats-summary">
                  <p>Total Assignments: <strong>{assignments.length}</strong></p>
                  <p>Recent: <strong>{sortedMonths[sortedMonths.length - 1]}</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Recent Users */}
            <div className="recent-card">
              <h3>Recent Users</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Organization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'Admin' ? 'bg-primary' :
                              user.role === 'Teacher' ? 'bg-success' : 'bg-info'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.organization?.organizationName || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="recent-card">
              <h3>Recent Assignments</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Uploaded</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssignments.map(assignment => (
                      <tr key={assignment.id}>
                        <td>{assignment.title}</td>
                        <td>{assignment.description.substring(0, 30)}...</td>
                        <td>{format(new Date(assignment.uploadedDate), 'MMM dd, yyyy')}</td>
                        <td>{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
