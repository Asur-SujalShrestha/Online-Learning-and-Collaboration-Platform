import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle, Loader, Search } from 'lucide-react';
import "../../CSS/SuperAdmin/Organizations.css";

function Organizations() {
    const [organizations, setOrganizations] = useState([]);
    const [activeTab, setActiveTab] = useState("PENDING");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpdating, setIsUpdating] = useState(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://192.168.101.6:8081/collapp/organization/get-all-organization");
            setOrganizations(response.data);
        } catch (error) {
            console.error("Error fetching organizations:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrganizationStatus = async (id, status) => {
        setIsUpdating(id);
        try {
            await axios.put(`https://192.168.101.6:8081/collapp/organization/update-organization/${id}`, status, {
                headers: { "Content-Type": "text/plain" },
            });
            fetchOrganizations();
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setTimeout(() => setIsUpdating(null), 1000);
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'ACTIVE': 
                return <span className="status-indicator active"><Check size={14} /> {status}</span>;
            case 'SUSPENDED': 
                return <span className="status-indicator suspended"><AlertCircle size={14} /> {status}</span>;
            case 'INACTIVE': 
                return <span className="status-indicator inactive"><X size={14} /> {status}</span>;
            case 'PENDING': 
                return <span className="status-indicator pending"><Loader size={14} /> {status}</span>;
            default: 
                return status;
        }
    };

    const filteredPendingOrganizations = organizations
        .filter(org => org.status === "PENDING")
        .filter(org => org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()));
        
    const filteredActiveOrganizations = organizations
        .filter(org => org.status !== "PENDING")
        .filter(org => org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1 
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="org-dashboard">
            <div className="org-header">
                <h1 className="org-title">Organization Management</h1>
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search organizations..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="org-tabs">
                <button 
                    className={activeTab === "PENDING" ? "tab-active" : ""} 
                    onClick={() => setActiveTab("PENDING")}
                >
                    Pending Approval
                    {/* {pendingCount > 0 && <span className="badge">{filteredPendingOrganizations.length}</span>} */}
                </button>
                <button 
                    className={activeTab === "ACTIVE" ? "tab-active" : ""} 
                    onClick={() => setActiveTab("ACTIVE")}
                >
                    Active Organizations
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading organizations...</p>
                </div>
            ) : (
                <>
                    {activeTab === "PENDING" && (
                        filteredPendingOrganizations.length > 0 ? (
                            <motion.div 
                                className="org-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredPendingOrganizations.map(org => (
                                    <motion.div 
                                        className="org-card pending" 
                                        key={org.id}
                                        variants={cardVariants}
                                    >
                                        <div className="org-card-header">
                                            <h3>{org.organizationName}</h3>
                                            {getStatusIcon(org.status)}
                                        </div>
                                        <div className="org-card-content">
                                            <div className="org-info">
                                                <div className="info-item">
                                                    <span className="info-label">Email:</span>
                                                    <span className="info-value">{org.email}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Phone:</span>
                                                    <span className="info-value">{org.phone}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Address:</span>
                                                    <span className="info-value">{org.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="org-card-footer">
                                            <button 
                                                className="action-btn approve-btn"
                                                onClick={() => updateOrganizationStatus(org.id, "ACTIVE")}
                                                disabled={isUpdating === org.id}
                                            >
                                                {isUpdating === org.id ? <div className="btn-loader"></div> : 'Approve'}
                                            </button>
                                            {/* <button 
                                                className="action-btn reject-btn"
                                                onClick={() => updateOrganizationStatus(org.id, "INACTIVE")}
                                                disabled={isUpdating === org.id}
                                            >
                                                {isUpdating === org.id ? <div className="btn-loader"></div> : 'Reject'}
                                            </button> */}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>No pending organizations</h3>
                                <p>All organization requests have been processed.</p>
                            </div>
                        )
                    )}

                    {activeTab === "ACTIVE" && (
                        filteredActiveOrganizations.length > 0 ? (
                            <motion.div 
                                className="org-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredActiveOrganizations.map(org => (
                                    <motion.div 
                                        className={`org-card ${org.status.toLowerCase()}`} 
                                        key={org.id}
                                        variants={cardVariants}
                                    >
                                        <div className="org-card-header">
                                            <h3>{org.organizationName}</h3>
                                            {getStatusIcon(org.status)}
                                        </div>
                                        <div className="org-card-content">
                                            <div className="org-info">
                                                <div className="info-item">
                                                    <span className="info-label">Email:</span>
                                                    <span className="info-value">{org.email}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Phone:</span>
                                                    <span className="info-value">{org.phone}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Address:</span>
                                                    <span className="info-value">{org.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="org-card-footer">
                                            <select
                                                className="status-select"
                                                value={org.status}
                                                onChange={(e) => updateOrganizationStatus(org.id, e.target.value)}
                                                disabled={isUpdating === org.id}
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="PENDING">Pending</option>
                                            </select>
                                            {isUpdating === org.id && <div className="select-loader"></div>}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🏢</div>
                                <h3>No active organizations</h3>
                                <p>There are no active organizations at the moment.</p>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}

export default Organizations;