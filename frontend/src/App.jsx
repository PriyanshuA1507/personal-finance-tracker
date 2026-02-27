import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Lazy load pages for performance optimization
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Transactions = React.lazy(() => import('./pages/Transactions'));

// Protects routes and checks roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized Access. Your role: {user.role}</div>;
  }
  return children;
};

// Simple Navigation Bar
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;
  return (
    <nav className="navbar">
      <h3 style={{ margin: 0, color: '#111827', fontWeight: 700 }}>FinanceTracker</h3>
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <div className="nav-right">
        <span>Logged in as: <strong style={{color: '#111827'}}>{user.username}</strong> ({user.role})</span>
        <button onClick={logout} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Logout</button>
      </div>
    </nav>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin', 'user', 'read-only']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute allowedRoles={['admin', 'user', 'read-only']}>
              <Transactions />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;