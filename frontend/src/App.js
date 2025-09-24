import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await axios.get('/api/health');
        setBackendStatus(response.data);
      } catch (error) {
        console.error('Error connecting to backend:', error);
        setBackendStatus({ status: 'disconnected' });
      } finally {
        setLoading(false);
      }
    };

    checkBackendStatus();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>GloboBeat</h1>
        <p>Porto Digital residency project for Globo</p>
        
        <div className="status-container">
          <h3>Backend Status:</h3>
          {loading ? (
            <p>Checking connection...</p>
          ) : (
            <div className={`status ${backendStatus?.status}`}>
              <p>Status: {backendStatus?.status || 'unknown'}</p>
              {backendStatus?.timestamp && (
                <p>Last check: {new Date(backendStatus.timestamp).toLocaleString()}</p>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;