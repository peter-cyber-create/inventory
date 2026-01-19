/**
 * Ministry of Health Uganda - Main Layout Component
 * Institutional layout with Header, Sidebar, and Content area
 */
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import '../../theme/moh-institutional-theme.css';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    return (
        <div className="app-layout" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'var(--color-bg-primary)'
        }}>
            <Header />
            
            <div style={{
                display: 'flex',
                flex: 1,
                marginTop: 'var(--header-height)'
            }}>
                <Sidebar collapsed={collapsed} user={user} />
                
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
