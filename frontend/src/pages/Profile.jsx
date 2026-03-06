import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import './Pages.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-container">
      <h2 className="page-title">My Profile</h2>
      <p className="page-subtitle">Manage your personal details and application settings.</p>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {/* Profile Identity Card */}
        <div className="stat-card">
          <div className="icon-wrapper icon-blue">
            <FaUserCircle />
          </div>
          <div className="stat-info">
            <p>Account Name</p>
            <h3 style={{ textTransform: 'capitalize' }}>{user?.username || 'Priyanshu'}</h3>
          </div>
        </div>

        {/* Security Role Card */}
        <div className="stat-card">
          <div className="icon-wrapper icon-purple">
            <FaShieldAlt />
          </div>
          <div className="stat-info">
            <p>Security Clearance</p>
            <h3 style={{ textTransform: 'uppercase', fontSize: '1.2rem' }}>
              {user?.role || 'Guest'}
            </h3>
          </div>
        </div>

        {/* Email Card */}
        <div className="stat-card">
          <div className="icon-wrapper icon-green">
            <FaEnvelope />
          </div>
          <div className="stat-info">
            <p>Contact Email</p>
            <h3 style={{ fontSize: '1.1rem' }}>{user?.username}@fintracker.app</h3>
          </div>
        </div>
      </div>

      <div className="admin-table-container" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.2rem' }}>Preferences</h3>
        <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
          Your UI preference (Dark/Light mode) is actively being synced to your local browser storage. Additional notification settings and 2FA will be available in the next release.
        </p>
      </div>
    </div>
  );
};

export default Profile;