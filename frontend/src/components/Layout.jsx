import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css'; // We will create this next

const Layout = () => {
  return (
    <div className="app-container">
      {/* The Sidebar stays fixed on the left */}
      <Sidebar />
      
      {/* The main content area takes up the rest of the screen */}
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;