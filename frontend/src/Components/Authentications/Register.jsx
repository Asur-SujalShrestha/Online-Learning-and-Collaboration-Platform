import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
    const [activeTab, setActiveTab] = useState('organization');
  const [formData, setFormData] = useState({
    organizationName: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePic: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ORGANIZATION}/register-organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.text();

      if (response.ok) {
        setSuccess(data);
        setFormData({
          organizationName: '',
          address: '',
          phone: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          dob: '',
          profilePic: ''
        });
      } else {
        setError(data);
      }
    } catch (err) {
      setError('Failed to register. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-containeres">
      <div className="login-left">
          <img
            src="src/assets/images/login.png"
            alt="CollApp background"
            className="background-image"
          />
          <h1 className="app-title">CollApp</h1>
        </div>
        
        <div className="login-right">
          <h1>Organization Registration</h1>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'organization' ? 'active' : ''}`}
              onClick={() => setActiveTab('organization')}
            >
              Organization Details
            </button>
            <button 
              className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Details
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'organization' ? (
              <div className="tab-content">
                <div className="form-group">
                  <label className="registerLabel" htmlFor="organizationName">Organization Name</label>
                  <input className="loginInputs"
                  placeholder='Enter Orgnaization Name'
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="registerLabel" htmlFor="address">Address</label>
                  <input className="loginInputs"
                    type="text"
                    id="address"
                    name="address"
                    placeholder='Enter Orgnaization Address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>


                <div className="form-group">
                  <label className="registerLabel" htmlFor="phone">Phone</label>
                  <input className="loginInputs"
                    type="tel"
                    placeholder='Enter Orgnaization Contact'
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="registerLabel" htmlFor="email">Email</label>
                  <input className="loginInputs"
                    type="email"
                    id="email"
                    placeholder='Enter Orgnaization Email'
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group password-group">
                  <label className="registerLabel" htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input className="loginInputs"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder='Enter Password'
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="next-btn"
                    onClick={() => setActiveTab('admin')}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="tab-content">
                <div className="form-group">
                  <label className="registerLabel" htmlFor="firstName">First Name</label>
                  <input className="loginInputs"
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder='Enter Admin First Name'
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="registerLabel" htmlFor="lastName">Last Name</label>
                  <input className="loginInputs"
                    type="text"
                    placeholder='Enter Admin Last Name'
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="registerLabel" htmlFor="dob">Date of Birth</label>
                  <input className="loginInputs"
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="registerLabel" htmlFor="profilePic">Profile Picture</label>
                  <input className="loginInputs"
                    type="file"
                    id="profilePic"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                  {formData.profilePic && (
                    <div className="preview-image">
                      <img src={formData.profilePic} alt="Profile Preview" />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="back-btn"
                    onClick={() => setActiveTab('organization')}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            )}

            <p>Already have an account? <Link to="/login">Sign in</Link></p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;