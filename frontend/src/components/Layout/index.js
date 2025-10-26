import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import AppHeader from './Header';
import AppSidebar from './Sidebar';

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser({ name: 'User', role: 'Administrator' });
      }
    } else {
      // Default user for demo purposes
      setUser({ name: 'Administrator', role: 'System Admin' });
    }
  }, []);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Uganda Flag Colors Stripe - Full Width */}
      <div style={{
        width: '100vw',
        height: '12px',
        background: 'linear-gradient(to right, #000000 0%, #000000 33.33%, #FFD700 33.33%, #FFD700 66.66%, #FF0000 66.66%, #FF0000 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}></div>
      
      <Layout style={{ minHeight: '100vh', marginTop: '12px' }}>
        <AppSidebar collapsed={collapsed} user={user} />
        <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'margin-left 0.2s' }}>
          <AppHeader collapsed={collapsed} onToggle={handleToggle} user={user} />
          <Content style={{
            margin: '24px',
            padding: '24px',
            background: 'transparent',
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AppLayout;
