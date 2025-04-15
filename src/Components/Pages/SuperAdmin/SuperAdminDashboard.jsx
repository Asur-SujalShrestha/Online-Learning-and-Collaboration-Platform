import React, { useState } from "react";
import "../../CSS/Admin.css"
import SuperAdminSidebar from "./SuperAdminSideBar";
import SuperAdminUsers from "./SuperAdminUser";
import SuperAdminPrograms from "./SuperAdminProgram";
import SuperAdminAssignments from "./SuperAdminAssignment";
import Organizations from "./Organizations";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div className="dashboard">
      <SuperAdminSidebar setActiveTab={setActiveTab} />
      <div className="content">
        {activeTab === "Users" && <SuperAdminUsers/>}
        {activeTab === "Program" && <SuperAdminPrograms/>}
        {activeTab === "Assignments" && <SuperAdminAssignments />}
        {activeTab === "Organizations" && <Organizations />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
