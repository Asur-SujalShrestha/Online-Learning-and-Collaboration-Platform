import React, { useState } from "react";
import { Home, Users, Book, FileText, LogOut, Menu } from "lucide-react";

const AdminSidebar = ({ setActiveTab, activeTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, tab: "Dashboard" },
    { name: "Users", icon: <Users size={20} />, tab: "Users" },
    { name: "Program", icon: <Book size={20} />, tab: "Program" },
    { name: "Assignments", icon: <FileText size={20} />, tab: "Assignments" },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="admin-sidebar-header">
        <h1 className="admin-logo">
          {!collapsed && "Admin"}
          {collapsed && "A"}
        </h1>
        <button 
          className="toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="menu-items">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            className={`menu-item ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => setActiveTab(item.tab)}
          >
            <span className="admin-icon">{item.icon}</span>
            {!collapsed && <span className="item-name">{item.name}</span>}
          </button>
        ))}
      </div>

      <button className="logout-btn">
        <span className="admin-icon"><LogOut size={20} /></span>
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};
export default AdminSidebar;
