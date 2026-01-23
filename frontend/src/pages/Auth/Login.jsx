/**
 * Ministry of Health Uganda - Institutional Login Page
 * Professional, authoritative, government-grade authentication interface
 */
import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import API from "../../helpers/api";
import LoadSpinner from "../../components/FNSpinner";
import '../../theme/moh-institutional-theme.css';

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

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
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            position: 'relative'
        }}>
            {/* Uganda Flag Accent Stripe - Top */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(to right, var(--uganda-black) 0%, var(--uganda-black) 33.33%, var(--uganda-yellow) 33.33%, var(--uganda-yellow) 66.66%, var(--uganda-red) 66.66%, var(--uganda-red) 100%)'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '440px'
            }}>
                {/* Institutional Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'var(--space-8)'
                }}>
                    {/* Coat of Arms */}
                    <div style={{
                        marginBottom: 'var(--space-5)',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <img 
                            src="/uganda-coat-of-arms.svg" 
                            alt="Uganda Coat of Arms" 
                            style={{
                                height: '80px',
                                width: 'auto'
                            }}
                        />
                    </div>
                    
                    {/* Ministry Title */}
                    <h1 style={{
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-2)',
                        letterSpacing: '-0.01em'
                    }}>
                        Ministry of Health Uganda
                    </h1>
                    
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-1)',
                        fontWeight: 'var(--font-weight-medium)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Inventory Management System
                    </p>
                    
                    <p style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-tertiary)',
                        margin: 0
                    }}>
                        Version 2.0.0
                    </p>
                </div>

                {/* Login Card */}
                <div className="card" style={{
                    border: '1px solid var(--color-border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div className="card-header">
                        <h2 style={{
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                            margin: 0
                        }}>
                            Sign In
                        </h2>
                        <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            margin: 'var(--space-2) 0 0 0'
                        }}>
                            Enter your credentials to access the system
                        </p>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Username Field */}
                            <div className="form-group">
                                <label 
                                    htmlFor="username" 
                                    className="form-label"
                                >
                                    Username
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="username"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField(null)}
                                        disabled={loading}
                                        autoComplete="username"
                                        style={{
                                            paddingLeft: '48px',
                                            paddingRight: '12px',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: focusedField === 'username' 
                                            ? 'var(--moh-primary)' 
                                            : 'var(--color-text-tertiary)',
                                        fontSize: '18px',
                                        transition: 'color var(--transition-base)',
                                        pointerEvents: 'none',
                                        zIndex: 1,
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1
                                    }}>
                                        👤
                                    </span>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label 
                                    htmlFor="password" 
                                    className="form-label"
                                >
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        style={{
                                            paddingLeft: '48px',
                                            paddingRight: '48px',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: focusedField === 'password' 
                                            ? 'var(--moh-primary)' 
                                            : 'var(--color-text-tertiary)',
                                        fontSize: '18px',
                                        transition: 'color var(--transition-base)',
                                        pointerEvents: 'none',
                                        zIndex: 1,
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1
                                    }}>
                                        🔒
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        style={{
                                            position: 'absolute',
                                            right: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--color-text-tertiary)',
                                            cursor: 'pointer',
                                            padding: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            zIndex: 2,
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '4px',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--space-5)'
                            }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}>
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                    Remember me
                                </label>
                                <a 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toast.info('Contact IT administrator for password reset');
                                    }}
                                    style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--moh-primary)',
                                        textDecoration: 'none',
                                        fontWeight: 'var(--font-weight-medium)'
                                    }}
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    marginTop: 'var(--space-4)'
                                }}
                            >
                                {loading ? (
                                    <LoadSpinner />
                                ) : (
                                    <>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Note */}
                    <div style={{
                        padding: 'var(--space-4) var(--space-5)',
                        borderTop: '1px solid var(--color-border-primary)',
                        background: 'var(--color-bg-secondary)',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-tertiary)',
                            margin: 0
                        }}>
                            For account access, contact your system administrator
                        </p>
                    </div>
                </div>

                {/* System Information */}
                <div style={{
                    marginTop: 'var(--space-6)',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-tertiary)',
                        margin: 0
                    }}>
                        © {new Date().getFullYear()} Ministry of Health Uganda. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
