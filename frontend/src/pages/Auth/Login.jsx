/**
 * Enterprise Inventory Management System - Login Page
 * Dark, minimal, authoritative design for internal operations
 */
import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import API from "../../helpers/api";
import LoadSpinner from "../../components/FNSpinner";
import './Login.css';

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberSession, setRememberSession] = useState(false);

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username.trim()) {
            toast.error("Username is required");
            return;
        }
        if (!password.trim()) {
            toast.error("Password is required");
            return;
        }

        setLoading(true);
        
        try {
            const res = await API.post(`/api/users/login`, { 
                username: username.trim(), 
                password 
            });

            if (res.data && res.data.status === 'success') {
                toast.success("Login successful");
                setLoading(false);
                
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("userRole", res.data.user.role);

                // Navigate based on role
                const role = res.data.user.role;
                if (role === 'it') {
                    history.push('/ict/dashboard');
                } else if (role === 'garage') {
                    history.push('/fleet/dashboard');
                } else if (role === 'store') {
                    history.push('/stores/dashboard');
                } else if (role === 'finance') {
                    history.push('/finance/dashboard');
                } else if (role === 'admin') {
                    history.push('/dashboard');
                } else {
                    history.push('/ict/dashboard');
                }
            } else {
                setLoading(false);
                toast.error("Invalid credentials. Please try again.");
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="enterprise-login-container">
            <div className="enterprise-login-grid">
                {/* Left Column - System Identity */}
                <div className="enterprise-login-left">
                    <div className="enterprise-login-content">
                        <div className="enterprise-logo-container">
                            <img 
                                src="/uganda-coat-of-arms.png" 
                                alt="Uganda Coat of Arms" 
                                className="enterprise-government-logo"
                                onError={(e) => {
                                    // Fallback to SVG if PNG fails
                                    e.target.src = '/uganda-coat-of-arms.svg';
                                }}
                            />
                        </div>
                        
                        <div className="enterprise-ministry-name">
                            <h2 className="enterprise-ministry-title">Ministry of Health Uganda</h2>
                        </div>
                        
                        <h1 className="enterprise-system-title">
                            Inventory Management System
                        </h1>
                        
                        <div className="enterprise-system-info">
                            <p className="enterprise-info-line enterprise-info-secondary">
                                Asset Tracking • Fleet Operations • Store Management
                            </p>
                        </div>

                        <div className="enterprise-system-meta">
                            <div className="enterprise-meta-item">
                                <span className="enterprise-meta-label">Version</span>
                                <span className="enterprise-meta-value">2.0.0</span>
                            </div>
                            <div className="enterprise-meta-item">
                                <span className="enterprise-meta-label">Environment</span>
                                <span className="enterprise-meta-value">Production</span>
                            </div>
                        </div>

                        <div className="enterprise-warning">
                            <p className="enterprise-warning-text">
                                Authorized personnel only. Unauthorized access is prohibited.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Login Panel */}
                <div className="enterprise-login-right">
                    <div className="enterprise-login-panel">
                        <div className="enterprise-login-header">
                            <h2 className="enterprise-login-title">Authentication</h2>
                            <p className="enterprise-login-subtitle">Enter your credentials to access the system</p>
                        </div>

                        <form onSubmit={handleSubmit} className="enterprise-login-form">
                            <div className="enterprise-form-group">
                                <label htmlFor="username" className="enterprise-form-label">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="enterprise-form-input"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    disabled={loading}
                                    autoComplete="username"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="enterprise-form-group">
                                <label htmlFor="password" className="enterprise-form-label">
                                    Password
                                </label>
                                <div className="enterprise-password-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="enterprise-form-input"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="enterprise-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? 'HIDE' : 'SHOW'}
                                    </button>
                                </div>
                            </div>

                            <div className="enterprise-form-actions">
                                <label className="enterprise-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="enterprise-checkbox"
                                        checked={rememberSession}
                                        onChange={(e) => setRememberSession(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span>Remember session</span>
                                </label>
                                <button
                                    type="button"
                                    className="enterprise-link-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toast.info('Contact system administrator for password reset');
                                    }}
                                >
                                    Reset password
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="enterprise-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <LoadSpinner />
                                ) : (
                                    'AUTHENTICATE'
                                )}
                            </button>
                        </form>

                        <div className="enterprise-login-footer">
                            <p className="enterprise-footer-text">
                                For access issues, contact IT Support
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
