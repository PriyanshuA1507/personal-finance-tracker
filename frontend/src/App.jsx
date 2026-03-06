import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Layout from './components/Layout';

// Import the new placeholder pages
import Analytics from './pages/Analytics';
import Performance from './pages/Performance';
import Users from './pages/Users';
import Profile from './pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route: No Sidebar here! */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes: Everything inside here gets the Sidebar! */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            
            {/* The New Placeholder Routes */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="performance" element={<Performance />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;