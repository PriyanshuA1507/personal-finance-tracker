import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaMoneyBillWave, FaChartBar, FaCreditCard, FaChartLine, 
  FaBolt, FaUsers, FaUser, FaMoon, FaSun, FaDoorOpen 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- DARK MODE LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode); 
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  // -----------------------

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FaMoneyBillWave className="logo-icon" />
        <h2>FinTracker</h2>
      </div>

      <div className="sidebar-user">
        <h3 className="user-name" style={{ textTransform: 'capitalize' }}>
          {user?.username || 'Guest User'}
        </h3>
        <span className="user-badge" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
          {user?.role || 'VIEWER'}
        </span>
      </div>

      <div className="sidebar-section">
        <p className="section-title">NAVIGATION</p>
        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaChartBar className="nav-icon" /> Dashboard
          </NavLink>
          
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaChartLine className="nav-icon" /> Analytics
          </NavLink>

          {/* THE FIX: Only Analysts and Admins can see the Transactions tab */}
          {(user?.role === 'analyst' || user?.role === 'admin') && (
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FaCreditCard className="nav-icon" /> Transactions
            </NavLink>
          )}

          <NavLink to="/performance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaBolt className="nav-icon" /> Performance
          </NavLink>

          {/* Only Admins can see the Users tab */}
          {user?.role === 'admin' && (
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FaUsers className="nav-icon" /> Users
            </NavLink>
          )}

          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaUser className="nav-icon" /> Profile
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-section">
        <p className="section-title">SETTINGS</p>
        <div className="nav-menu">
          <button className="nav-btn" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <><FaSun className="nav-icon warning-icon" /> Light Mode</>
            ) : (
              <><FaMoon className="nav-icon warning-icon" /> Dark Mode</>
            )}
          </button>
          
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            <FaDoorOpen className="nav-icon logout-icon" /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
