
// AdminUsers.jsx
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Search, Plus, X, UserPlus, ChevronDown, Filter } from "lucide-react";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
  const userId = token ? jwtDecode(token).id : null;
  const organizationId = token ? jwtDecode(token).organization : null;
  
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    address: "",
    organizationId: organizationId,
    password: "",
    role: "Student",
    profilePic: null
  });

  const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_USER}/get-user-by-organization/${organizationId}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    fetch(`${import.meta.env.VITE_API_USER}/update-user-role/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: newRole,
    })
      .then((res) => {
        if (res.ok) {
          setUsers(users.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        } else {
          toast.error("User's Role Not Updated")
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_USER}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.ok ? res.text() : Promise.reject(res.text()))
      .then(() => {
        setShowAddForm(false);
        setNewUser({
          firstName: "",
          lastName: "",
          dob: "",
          email: "",
          address: "",
          password: "",
          organizationId: organizationId,
          role: "Student",
          profilePic
        });
        fetchUsers();
      })
      .catch((err) => toast.error(err.data));
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = filterRole === "All" || user.role === filterRole;
    return nameMatch && roleMatch;
  });

  return (
    <div className="users">
      <div className="page-header">
        <h2>User Management</h2>
        <div className="page-actions">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <button 
              className="filter-button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>{filterRole}</span>
              <ChevronDown size={16} />
            </button>
            
            {isFilterOpen && (
              <div className="filter-dropdown">
                <div onClick={() => { setFilterRole("All"); setIsFilterOpen(false); }}>All</div>
                <div onClick={() => { setFilterRole("Admin"); setIsFilterOpen(false); }}>Admin</div>
                <div onClick={() => { setFilterRole("Teacher"); setIsFilterOpen(false); }}>Teacher</div>
                <div onClick={() => { setFilterRole("Student"); setIsFilterOpen(false); }}>Student</div>
              </div>
            )}
          </div>
          
          <button onClick={() => setShowAddForm(true)} className="add-btn">
            <UserPlus size={18} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Organization</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="table-row">
                <td>
                  <img 
                    src={user.profilePic || "https://via.placeholder.com/40"} 
                    alt={user.firstName} 
                    className="profile-pic" 
                  />
                </td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value={`Admin`}>Admin</option>
                    <option value={`Teacher`}>Teacher</option>
                    <option value={`Student`}>Student</option>
                  </select>
                </td>
                <td>{user.organization.organizationName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button onClick={() => setShowAddForm(false)} className="user-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="add-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" placeholder="First Name" required onChange={handleInputChange} value={newUser.firstName} />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" placeholder="Last Name" required onChange={handleInputChange} value={newUser.lastName} />
                </div>
                
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input name="dob" type="date" required onChange={handleInputChange} value={newUser.dob} />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="Email" required onChange={handleInputChange} value={newUser.email} />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" placeholder="Address" required onChange={handleInputChange} value={newUser.address} />
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Password" required onChange={handleInputChange} value={newUser.password} />
                </div>
                
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" onChange={handleInputChange} value={newUser.role} className="role-select">
                    <option value="Admin">Admin</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Register User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
