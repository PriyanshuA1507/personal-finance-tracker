import React from 'react';
import './Pages.css';

const Users = () => {
  // Hardcoded dummy data to demonstrate your database structure to interviewers
  const mockUsers = [
    { id: 1, username: 'admin', role: 'admin', lastLogin: 'Just now', status: 'Active' },
    { id: 2, username: 'testuser', role: 'user', lastLogin: '2 hours ago', status: 'Active' },
    { id: 3, username: 'guest', role: 'read-only', lastLogin: '1 day ago', status: 'Restricted' },
  ];

  return (
    <div className="page-container">
      <h2 className="page-title">User Management</h2>
      <p className="page-subtitle">View and manage system access and Role-Based Access Control (RBAC).</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Access Role</th>
              <th>Status</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td style={{ fontWeight: '600' }}>{user.username}</td>
                <td>
                  <span className={`role-badge role-${user.role === 'read-only' ? 'guest' : user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>{user.status}</td>
                <td>{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;