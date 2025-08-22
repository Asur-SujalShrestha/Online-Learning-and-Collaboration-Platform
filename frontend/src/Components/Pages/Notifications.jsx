import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Bell, Send, Clock, AlertCircle } from 'lucide-react';
import '../CSS/Notifications.css';

const Notifications = () => {
  // States for the notifications list and the form inputs
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  
  const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
  const userId = token ? jwtDecode(token).id : null;

  // Fetch all notifications then locally filter based on:
  // (user is null) OR (notification.user exists and notification.user.id === currentUserId)
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_NOTIFICATION}/get-notice`);
      const filteredNotifications = response.data.filter(notif => {
        return notif.user === null || (notif.user && notif.user.id === userId);
      });
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle the form submission to add a new notification
  const handleAddNotification = async (e) => {
    e.preventDefault();
    try {
      // Construct the payload. Here we assume any new notification is for the current user
      const payload = {
        title,
        description,
        receiverId: userId,
      };
      
      await axios.post(`${import.meta.env.VITE_API_NOTIFICATION}/add-notice`, payload);
      
      // Clear the form fields
      setTitle('');
      setDescription('');
      
      // Show success toast
      showToast("Notification added successfully!");
      
      // Refresh the notifications list
      fetchNotifications();
      
      // Hide the form
      setFormVisible(false);
    } catch (error) {
      console.error("Error adding notification", error);
      showToast("Failed to add notification!", true);
    }
  };

  // Simple toast notification function (append to DOM)
  const showToast = (message, isError = false) => {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }, 100);
  };

  // Get the appropriate background color for a notification
  const getNotificationColor = (index) => {
    const colors = ['#f3f4ff', '#fff9f3', '#f3fff9', '#fff3fa'];
    return colors[index % colors.length];
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If it's today, just show the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h1><Bell className="icon pulse" /> Notifications</h1>
        <button 
          className="toggle-form-btn"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? 'Cancel' : 'New Notification'}
        </button>
      </div>
      
      {formVisible && (
        <div className="notification-form slide-down">
          <h2>Create New Notification</h2>
          <form onSubmit={handleAddNotification}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter notification details"
                required
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setFormVisible(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                <Send size={16} /> Send Notification
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notification-list">
        <h2>Your Notifications</h2>
        
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>No notifications available</p>
            <button className="create-btn" onClick={() => setFormVisible(true)}>
              Create your first notification
            </button>
          </div>
        ) : (
          <ul className="notification-items">
            {notifications.map((notif, index) => (
              <li 
                key={notif.id} 
                className="notification-item fade-in"
                style={{ animationDelay: `${index * 0.1}s`, backgroundColor: getNotificationColor(index) }}
              >
                <div className="notif-content">
                  <h3>{notif.title}</h3>
                  <p>{notif.description}</p>
                  <div className="notif-footer">
                    <span className="notif-date">
                      <Clock size={14} /> {formatDate(notif.date)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;