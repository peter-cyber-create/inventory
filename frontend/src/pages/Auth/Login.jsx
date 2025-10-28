/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify";
import API from "../../helpers/api";
import LoadSpinner from "../../components/FNSpinner";
// Uganda Coat of Arms - Official emblem
const ugandaCoatOfArms = '/uganda-coat-of-arms.svg';

const Login = () => {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const history = useHistory();

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const res = await API.post(`/users/login`, { username, password });
            console.log(res)

            if (res.data.status === 'success') {
                toast.success(`User Login Successful`);
                setLoading(false)
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("userRole", res.data.user.role);

                if (res.data.user.role === 'it') {
                    history.push('/ict/dashboard')
                } else if (res.data.user.role === 'garage') {
                    history.push('/fleet/dashboard')
                } else if (res.data.user.role === 'store') {
                    history.push('/stores/dashboard')
                } else if (res.data.user.role === 'finance') {
                    history.push('/finance/dashboard')
                } else if (res.data.user.role === 'admin') {
                    history.push('/dashboard')  // Main admin dashboard
                } else {
                    history.push('/ict/dashboard')
                }
            }
        } catch (error) {
            setLoading(false);
            toast.error(`User Login Failed`);
        }
    };

    return (
        <div className="moh-login-page" style={{
            height: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231e40af" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.5
            }}></div>
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        {/* Enhanced MoH Uganda Header */}
                        <div className="text-center mb-5">
                            <div className="moh-brand" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '20px',
                                marginBottom: '32px'
                            }}>
                                {/* Uganda Coat of Arms Container */}
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 6px 20px rgba(15,23,42,0.3)',
                                    border: '3px solid #FFD700',
                                    position: 'relative',
                                    padding: '14px'
                                }}>
                                    <img 
                                        src={ugandaCoatOfArms} 
                                        alt="Uganda Coat of Arms" 
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                        }}
                                    />
                                    {/* Enhanced Glow Effect */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-3px',
                                        left: '-3px',
                                        right: '-3px',
                                        bottom: '-3px',
                                        background: 'linear-gradient(45deg, #0f172a, #FFD700, #1e293b)',
                                        borderRadius: '50%',
                                        zIndex: -1,
                                        filter: 'blur(8px)',
                                        opacity: 0.5
                                    }}></div>
                                </div>
                                
                                <div className="moh-title">
                                    <h1 style={{
                                        margin: 0, 
                                        fontSize: '1.8rem',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #006747 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        lineHeight: 1.1,
                                        letterSpacing: '0.02em',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                                    }}>
                                        Ministry of Health Uganda
                                    </h1>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginTop: '8px',
                                        filter: 'drop-shadow(0 1px 2px rgba(255,215,0,0.3))'
                                    }}>
                                        Inventory Management System
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="moh-card" style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.25), 0 6px 24px rgba(0,103,71,0.15)',
                            overflow: 'hidden',
                            position: 'relative',
                            maxWidth: '420px',
                            width: '100%'
                        }}>
                            {/* Card Glow Effect */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(0,103,71,0.08) 0%, rgba(255,215,0,0.08) 100%)',
                                borderRadius: '20px',
                                zIndex: 0
                            }}></div>
                            
                            <div style={{
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                padding: '24px 20px',
                                textAlign: 'center',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <h3 style={{
                                    color: '#FFFFFF',
                                    margin: 0,
                                    fontSize: '1.4rem',
                                    fontWeight: 600
                                }}>
                                    Welcome Back
                                </h3>
                                <p style={{
                                    color: '#e2e8f0',
                                    margin: '6px 0 0 0',
                                    fontSize: '0.9rem',
                                    fontWeight: 400
                                }}>
                                    Sign in to access your professional dashboard
                                </p>
                            </div>
                            
                            <div style={{ 
                                padding: '24px',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                
                                <form className="form-horizontal" style={{ marginTop: '0' }}>
                                    <div className="mb-4">
                                        <label htmlFor="username" className="form-label" style={{
                                            fontWeight: 600,
                                            color: '#374151',
                                            marginBottom: '8px',
                                            fontSize: '0.9rem',
                                            display: 'block'
                                        }}>
                                            Username
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="username" 
                                                placeholder="Enter your username"
                                                value={username}
                                                onChange={(e) => setUserName(e.target.value)}
                                                style={{
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    padding: '12px 16px 12px 40px',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s ease',
                                                    background: '#ffffff',
                                                    width: '100%',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#1e40af';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.15)';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#E1E5E9';
                                                    e.target.style.boxShadow = 'none';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            />
                                            <i className="mdi mdi-account" style={{
                                                position: 'absolute',
                                                left: '14px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '16px',
                                                color: '#6b7280',
                                                opacity: 0.8
                                            }}></i>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label" style={{
                                            fontWeight: 600,
                                            color: '#374151',
                                            marginBottom: '8px',
                                            fontSize: '0.9rem',
                                            display: 'block'
                                        }}>
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter your password"
                                                aria-label="Password"
                                                aria-describedby="password-addon"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                style={{
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    padding: '12px 16px 12px 40px',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s ease',
                                                    background: '#ffffff',
                                                    width: '100%',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.background = '#f8fafc';
                                                    e.target.style.borderColor = '#1e40af';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.15)';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.background = '#ffffff';
                                                    e.target.style.borderColor = '#d1d5db';
                                                    e.target.style.boxShadow = 'none';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            />
                                            <i className="mdi mdi-lock" style={{
                                                position: 'absolute',
                                                left: '14px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '16px',
                                                color: '#6b7280',
                                                opacity: 0.8
                                            }}></i>
                                            <button
                                                className="btn"
                                                type="button"
                                                id="password-addon"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                tabIndex={-1}
                                                style={{
                                                    position: 'absolute',
                                                    right: '6px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: '#0f172a',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '6px 8px',
                                                    color: '#ffffff',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 1px 4px rgba(15,23,42,0.3)',
                                                    fontSize: '12px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = '#1e293b';
                                                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                                    e.target.style.boxShadow = '0 2px 8px rgba(15,23,42,0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = '#0f172a';
                                                    e.target.style.transform = 'translateY(-50%) scale(1)';
                                                    e.target.style.boxShadow = '0 1px 4px rgba(15,23,42,0.3)';
                                                }}
                                            >
                                                <i className={showPassword ? "mdi mdi-eye-off-outline" : "mdi mdi-eye-outline"}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="rememberMe"
                                                    style={{
                                                        marginRight: '8px',
                                                        transform: 'scale(1.2)'
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="rememberMe" style={{
                                                    fontSize: '0.9rem',
                                                    color: '#64748b',
                                                    margin: 0,
                                                    cursor: 'pointer'
                                                }}>
                                                    Remember me
                                                </label>
                                            </div>
                                            <a href="#" style={{
                                                fontSize: '0.9rem',
                                                color: '#1e40af',
                                                textDecoration: 'none',
                                                fontWeight: 500
                                            }}>
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-5 d-grid">
                                        <button 
                                            className="btn" 
                                            type="submit" 
                                            onClick={handleSubmit}
                                            style={{
                                                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '12px 24px',
                                                color: '#FFFFFF',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 2px 8px rgba(15,23,42,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                width: '100%'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 4px 16px rgba(15,23,42,0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 2px 8px rgba(15,23,42,0.3)';
                                            }}
                                        >
                                            {loading ? (
                                                <LoadSpinner />
                                            ) : (
                                                <>
                                                    <i className="mdi mdi-login me-2" style={{ fontSize: '18px' }}></i>
                                                    Sign In
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <div style={{
                                padding: '16px',
                                background: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                            }}>
                                <p style={{
                                    margin: 0,
                                    color: '#64748b',
                                    fontSize: '0.8rem',
                                    fontWeight: 400
                                }}>
                                    Don't have an account? 
                                    <a href="#" style={{
                                        color: '#0f172a',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        marginLeft: '6px'
                                    }}> 
                                        Contact IT Admin 
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;