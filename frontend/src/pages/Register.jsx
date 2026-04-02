import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // In production on Render, the backend and frontend share the same URL
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert("Registration successful! You can now log in.");
      navigate('/login'); // Send them back to the login page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2>Create an Account</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Join the Personal Finance Tracker</p>
        
        {error && <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Choose a username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            placeholder="Choose a password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '0.75rem', backgroundColor: 'var(--primary-color, #4f46e5)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Register
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color, #4f46e5)', textDecoration: 'none' }}>Sign In here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
