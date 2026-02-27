import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Hit the backend login endpoint
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password,
      });
      
      // Pass token, role, and username to global state
      login(response.data);
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

 return (
    <div className="form-container card">
      <h2>Welcome Back</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please enter your details to sign in.</p>
      
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>Sign In</button>
      </form>
    </div>
  );
};

export default Login;