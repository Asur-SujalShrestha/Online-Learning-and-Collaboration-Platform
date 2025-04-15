import React, { useState } from "react";
import AdminSidebar from "./AdminSideBar";
import AdminUsers from "./Users";
import AdminProgram from "./Programs";
import AdminAssignments from "./Assignments";
import "../../CSS/Admin.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div className="dashboard">
      <AdminSidebar setActiveTab={setActiveTab} />
      <div className="content">
        {activeTab === "Users" && <AdminUsers/>}
        {activeTab === "Program" && <AdminProgram />}
        {activeTab === "Assignments" && <AdminAssignments />}
      </div>
    </div>
  );
};

export default AdminDashboard;
