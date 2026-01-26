/**
 * Ministry of Health Uganda - Main Layout Component
 * Institutional layout with Header, Sidebar, and Content area
 */
import React, { useState, useEffect } from "react";
import AppHeader from "./Header";
import Footer from "./Footer";
import AppSidebar from "./Sidebar";
import '../../theme/moh-institutional-theme.css';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    if (parsedUser && typeof parsedUser === 'object') {
                        setUser(parsedUser);
                    }
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    // Clear invalid data
                    localStorage.removeItem('user');
                }
            }
        } catch (e) {
            console.error('Error accessing localStorage:', e);
        }
    }, []);

    return (
        <div className="app-layout" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'var(--color-bg-primary)'
        }}>
            <AppHeader />
            
            <div style={{
                display: 'flex',
                flex: 1,
                marginTop: 'var(--header-height)'
            }}>
                <AppSidebar collapsed={collapsed} user={user} />
                
                <main style={{
                    flex: 1,
                    marginLeft: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
                    transition: 'margin-left var(--transition-base)',
                    minHeight: 'calc(100vh - var(--header-height))',
                    background: 'var(--color-bg-primary)'
                }}>
                    <div style={{
                        padding: 'var(--space-6)',
                        maxWidth: 'var(--content-max-width)',
                        margin: '0 auto',
                        width: '100%'
                    }}>
                        {children}
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
