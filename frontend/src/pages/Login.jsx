import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ADDED: Link imported here
import api from '../services/api'; 
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
      const response = await api.post('/auth/login', {
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
      
      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>Sign In</button>
      </form>

      {/* ADDED: Registration Link */}
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>
          Create one here
        </Link>
      </p>
    </div>
  );
};

export default Login;
