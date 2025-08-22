import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ConferencesPage() {
  const navigate = useNavigate();

  // State for form input, conference list, and error messages
  const [newTitle, setNewTitle] = useState('');
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [createError, setCreateError] = useState('');
  const [joinError, setJoinError] = useState('');
  const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
      const userId = token ? jwtDecode(token).id : null;

  // Fetch the list of conferences on component mount
  useEffect(() => {
    const fetchConferences = async () => {
        setLoading(true);
        setFetchError('');
        try {
          const res = await fetch('https://192.168.101.3:8081/api/conferences/get-conference', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          if (!res.ok) {
            setFetchError('Failed to load conferences.');
          } else {
            const data = await res.json();
            console.log(data);
            setConferences(data); // assuming data is an array of { id, title }
          }
        } catch (error) {
          console.log(error);
          setFetchError('Unable to fetch conferences. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      

    fetchConferences();
  }, []);  // empty dependency ensures this runs once on mount

  // Handler for creating a new conference
  const handleCreateConference = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      // Basic validation: title is required
      setCreateError('Conference title is required.');
      return;
    }
    setCreateError('');  // reset any previous error
    try {
      const res = await fetch('https://192.168.101.3:8081/api/conferences/create-conference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ title: newTitle.trim() })
      });
      if (!res.ok) {
        // Handle error status from server
        setCreateError('Failed to create conference. Please try again.');
      } else {
        const createdConf = await res.json();  // expected { id: "...", title: "..." }
        // Redirect to the new conference room
        navigate(`/conference/${createdConf.id}`);
      }
    } catch (error) {
      // Handle network errors
      setCreateError('Network error. Please try again.');
    }
  };

  // Handler for joining an existing conference
  const handleJoinConference = async (confId, confTitle) => {
    setJoinError('');  // reset any previous join error
    try {
      const res = await fetch(`https://192.168.101.3:8081/api/conferences/${confId}/join`, { method: 'POST',
        
        headers: { 
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ title: newTitle.trim() })
      });
      if (!res.ok) {
        setJoinError(`Failed to join the conference "${confTitle}".`);
      } else {
        // Successfully joined, navigate to the conference room
        navigate(`/conference/${confId}`);
      }
    } catch (error) {
      setJoinError(`Unable to join the conference "${confTitle}". Please try again.`);
    }
  };

  return (
    <div className="conferences-page">
      <h1>Video Conferences</h1>

      {/* Conference Creation Form */}
      <form onSubmit={handleCreateConference}>
        <div>
          <label htmlFor="conf-title">New Conference Title:</label><br />
          <input
            id="conf-title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter conference title"
            required
          />
        </div>
        <button type="submit">Create Conference</button>
      </form>
      {createError && <p className="error-message">{createError}</p>}

      <hr />

      {/* Conferences List */}
      <h2>Active Conferences</h2>
      {fetchError && <p className="error-message">{fetchError}</p>}
      {loading ? (
        <p>Loading conferences...</p>
      ) : (
        <ul>
          {conferences.map(conf => (
            <li key={conf.id} style={{ marginBottom: '0.5em' }}>
              <span>{conf.title}</span>
              <button 
                style={{ marginLeft: '1em' }}
                onClick={() => handleJoinConference(conf.id, conf.title)}
              >
                Join
              </button>
            </li>
          ))}
          {conferences.length === 0 && !fetchError && !loading && (
            <li>No conferences available.</li>
          )}
        </ul>
      )}
      {joinError && <p className="error-message">{joinError}</p>}
    </div>
  );
}

export default ConferencesPage;
