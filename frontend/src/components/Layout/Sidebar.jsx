
import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import {
  CarOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ToolOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  TeamOutlined,
  BankOutlined,
  CalendarOutlined,
  DollarOutlined,
  SafetyOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  BuildOutlined,
  ContainerOutlined,
  CarFilled,
  ToolFilled,
  FileTextFilled,
  ExclamationCircleOutlined,
  LaptopOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text, Title } = Typography;

const AppSidebar = ({ collapsed, user }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const history = useHistory();
  const location = useLocation();

  // Define all modules with their information
  const modules = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardOutlined />,
      roles: ['admin'] // Only admin sees main dashboard
    },
    {
      key: 'it',
      title: 'IT Assets',
      icon: <LaptopOutlined />,
      roles: ['admin', 'it'] // Admin and IT users
    },
    {
      key: 'fleet',
      title: 'Fleet Management',
      icon: <CarOutlined />,
      roles: ['admin', 'garage'] // Admin and garage users
    },
    {
      key: 'stores',
      title: 'Stores Management',
      icon: <InboxOutlined />,
      roles: ['admin', 'store'] // Admin and store users
    },
    {
      key: 'finance',
      title: 'Finance',
      icon: <DollarOutlined />,
      roles: ['admin', 'finance'] // Admin and finance users
    },
    {
      key: 'admin',
      title: 'Administration',
      icon: <SettingOutlined />,
      roles: ['admin'] // Only admin sees administration
    }
  ];

  // Get current module from pathname
  const getCurrentModule = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path.includes('/ict/')) return 'it';
    if (path.includes('/fleet/')) return 'fleet';
    if (path.includes('/stores/')) return 'stores';
    if (path.includes('/finance/')) return 'finance';
    if (path.includes('/admin/') || path.includes('/users/') || path.includes('/settings/')) return 'admin';
    return null;
  };

  useEffect(() => {
    // Set selected key based on current location
    const path = location.pathname;
    setSelectedKeys([path]);
    
    // Set open keys for submenus
    if (path.includes('/ict/')) {
      setOpenKeys(['ict-admin', 'ict-reports']);
    } else if (path.includes('/fleet/')) {
      setOpenKeys(['fleet-masters', 'fleet-reports']);
    } else if (path.includes('/stores/')) {
      setOpenKeys(['stores-admin', 'stores-reports']);
    } else if (path.includes('/activities/') || path.includes('/report/')) {
      setOpenKeys(['activity-reports']);
    } else if (path.includes('/admin/')) {
      setOpenKeys(['admin-reports']);
    }
  }, [location]);

  const handleMenuClick = ({ key }) => {
    if (key === 'dashboard') {
      // Role-specific dashboard routing
      const userRole = user?.role || localStorage.getItem('userRole');
      if (userRole === 'admin') {
        history.push('/dashboard'); // Main admin dashboard
      } else if (userRole === 'it') {
        history.push('/ict/dashboard');
      } else if (userRole === 'garage') {
        history.push('/fleet/dashboard');
      } else if (userRole === 'store') {
        history.push('/stores/dashboard');
      } else if (userRole === 'finance') {
        history.push('/finance/dashboard');
      } else {
        history.push('/ict/dashboard');
      }
    } else if (key === 'landing') {
      history.push('/landing');
    } else {
      history.push(key);
    }
  };

  // Get menu items for a specific module
  const getModuleMenuItems = useCallback((moduleKey) => {
    if (!moduleKey) return [];

    switch (moduleKey) {
      case 'dashboard':
        return [
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Overview'
          },
          {
            key: '/dashboard/analytics',
            icon: <BarChartOutlined />,
            label: 'Analytics'
          }
        ];

      case 'it':
        return [
          {
            key: '/ict/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
          },
          {
            key: '/ict/assets',
            icon: <DatabaseOutlined />,
            label: 'Assets Inventory'
          },
          {
            key: '/ict/maintanance',
            icon: <ToolOutlined />,
            label: 'Maintenance'
          },
          {
            key: '/ict/requisition',
            icon: <FileSearchOutlined />,
            label: 'Requisitions'
          },
          {
            key: '/ict/issue',
            icon: <ContainerOutlined />,
            label: 'Issue Management'
          },
          {
            key: '/ict/servers',
            icon: <GlobalOutlined />,
            label: 'Servers'
          },
          {
            key: 'ict-admin',
            icon: <SettingOutlined />,
            label: 'Administration',
            children: [
              {
                key: '/ict/categories',
                icon: <AppstoreOutlined />,
                label: 'Categories'
              },
              {
                key: '/ict/brands',
                icon: <AppstoreOutlined />,
                label: 'Brands'
              },
              {
                key: '/ict/models',
                icon: <AppstoreOutlined />,
                label: 'Models'
              },
              {
                key: '/ict/types',
                icon: <AppstoreOutlined />,
                label: 'Types'
              },
              {
                key: '/ict/departments',
                icon: <TeamOutlined />,
                label: 'Departments'
              },
              {
                key: '/ict/divisions',
                icon: <TeamOutlined />,
                label: 'Divisions'
              },
              {
                key: '/ict/facilities',
                icon: <BankOutlined />,
                label: 'Facilities'
              },
              {
                key: '/ict/staff',
                icon: <UserOutlined />,
                label: 'Staff'
              },
              {
                key: '/ict/users',
                icon: <UserOutlined />,
                label: 'Users'
              }
            ]
          },
          {
            key: 'ict-reports',
            icon: <BarChartOutlined />,
            label: 'Reports',
            children: [
              {
                key: '/ict/reports/inventory',
                icon: <BarChartOutlined />,
                label: 'Inventory Report'
              },
              {
                key: '/ict/reports/users',
                icon: <BarChartOutlined />,
                label: 'Users Report'
              },
              {
                key: '/ict/reports/transfers',
                icon: <BarChartOutlined />,
                label: 'Transfers Report'
              },
              {
                key: '/ict/reports/maintenance',
                icon: <BarChartOutlined />,
                label: 'Maintenance Report'
              },
              {
                key: '/ict/reports/disposal',
                icon: <BarChartOutlined />,
                label: 'Disposal Report'
              }
            ]
          }
        ];

      case 'fleet':
        return [
          {
            key: '/fleet/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
          },
          {
            key: '/fleet/vehicles',
            icon: <CarFilled />,
            label: 'Vehicles'
          },
          {
            key: '/fleet/spareparts',
            icon: <ToolFilled />,
            label: 'Spare Parts'
          },
          {
            key: '/fleet/requistion',
            icon: <FileSearchOutlined />,
            label: 'Requisitions'
          },
          {
            key: '/fleet/receiving',
            icon: <ContainerOutlined />,
            label: 'Receiving'
          },
          {
            key: '/fleet/jobcards',
            icon: <FileTextFilled />,
            label: 'Job Cards'
          },
          {
            key: 'fleet-masters',
            icon: <SettingOutlined />,
            label: 'Master Data',
            children: [
              {
                key: '/fleet/vehicles/types',
                icon: <AppstoreOutlined />,
                label: 'Vehicle Types'
              },
              {
                key: '/fleet/vehicles/make',
                icon: <AppstoreOutlined />,
                label: 'Vehicle Makes'
              },
              {
                key: '/fleet/masters/drivers',
                icon: <UserOutlined />,
                label: 'Drivers'
              },
              {
                key: '/fleet/masters/garages',
                icon: <BuildOutlined />,
                label: 'Garages'
              },
              {
                key: '/fleet/masters/categories',
                icon: <AppstoreOutlined />,
                label: 'Spare Categories'
              },
              {
                key: '/fleet/masters/departments',
                icon: <TeamOutlined />,
                label: 'Departments'
              }
            ]
          },
          {
            key: 'fleet-reports',
            icon: <BarChartOutlined />,
            label: 'Reports',
            children: [
              {
                key: '/fleet/reports/servicehistory',
                icon: <BarChartOutlined />,
                label: 'Service History'
              }
            ]
          }
        ];

      case 'stores':
        return [
          {
            key: '/stores/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
          },
          {
            key: '/stores/grn',
            icon: <FileTextOutlined />,
            label: 'GRN (Goods Received Notes)'
          },
          {
            key: '/stores/ledger',
            icon: <FileTextOutlined />,
            label: 'Stock Ledger'
          },
          {
            key: '/stores/form76a',
            icon: <FileSearchOutlined />,
            label: 'Requisitions/Issuance (Form 76A)'
          },
          {
            key: '/stores/reports',
            icon: <BarChartOutlined />,
            label: 'Reports'
          }
        ];

      case 'finance':
        return [
          {
            key: '/finance/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
          },
          {
            key: '/activities/add',
            icon: <FileTextOutlined />,
            label: 'Add Activity'
          },
          {
            key: '/activities/listing',
            icon: <FileTextOutlined />,
            label: 'Activities List'
          },
          {
            key: '/activities/users',
            icon: <UserOutlined />,
            label: 'Users'
          },
          {
            key: 'activity-reports',
            icon: <BarChartOutlined />,
            label: 'Reports',
            children: [
              {
                key: '/report/activities',
                icon: <CalendarOutlined />,
                label: 'Activities by Date'
              },
              {
                key: '/report/funding',
                icon: <DollarOutlined />,
                label: 'Activities by Funding'
              },
              {
                key: '/report/person',
                icon: <UserOutlined />,
                label: 'Activities by Person'
              },
              {
                key: '/report/accountability',
                icon: <SafetyOutlined />,
                label: 'Pending Accountability'
              },
              {
                key: '/report/participant/activity',
                icon: <TeamOutlined />,
                label: 'Activities by Participant'
              },
              {
                key: '/report/flagged',
                icon: <ExclamationCircleOutlined />,
                label: 'Flagged Users'
              },
              {
                key: '/report/user/amounts',
                icon: <DollarOutlined />,
                label: 'User Amounts'
              }
            ]
          }
        ];

      case 'admin':
        return [
          {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Admin Dashboard'
          },
          {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'User Management'
          },
          {
            key: '/admin/roles',
            icon: <TeamOutlined />,
            label: 'Roles & Permissions'
          },
          {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'System Settings'
          },
          {
            key: 'admin-reports',
            icon: <BarChartOutlined />,
            label: 'System Reports',
            children: [
              {
                key: '/admin/reports/overview',
                icon: <BarChartOutlined />,
                label: 'System Overview'
              },
              {
                key: '/admin/reports/modules',
                icon: <BarChartOutlined />,
                label: 'Module Reports'
              }
            ]
          }
        ];

      default:
        return [];
    }
  }, []);

  // Filter modules based on user role - users only see their specific module
  const visibleModules = modules.filter(module => {
    const userRole = user?.role;
    
    if (!userRole) return false;
    
    // Admin sees all modules
    if (userRole === 'admin') {
      return true;
    }
    
    // Other users only see their specific module
    if (userRole === 'it' && module.key === 'it') return true;
    if (userRole === 'garage' && module.key === 'fleet') return true;
    if (userRole === 'store' && module.key === 'stores') return true;
    if (userRole === 'finance' && module.key === 'finance') return true;
    
    return false;
  });

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
              style={{
            background: '#1e293b',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            borderRight: '2px solid #FFD700',
            overflow: 'hidden',
            overflowY: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            scrollbarWidth: 'thin',
            scrollbarColor: '#FFD700 transparent'
        }}
      width={280}
    >
      {/* User Profile Section */}
      {!collapsed && (
        <div style={{
          padding: '24px 16px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '16px'
        }}>
                      <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: '3px solid #FFD700',
                    boxShadow: '0 2px 8px rgba(30,64,175,0.2)',
                    marginBottom: '12px'
                }}
            />
          <Title level={5} style={{ color: '#FFFFFF', margin: '12px 0 4px 0' }}>
            {user?.name || 'User Name'}
          </Title>
          <Text style={{ color: '#FFD700', fontSize: '12px', textTransform: 'capitalize' }}>
            {user?.role || 'User Role'}
          </Text>
        </div>
      )}

      {/* Navigation Menu */}
      <div style={{ padding: '0 8px' }}>
        {/* Show All Modules with Their Pages */}
        {visibleModules.map((module) => {
          const moduleMenuItems = getModuleMenuItems(module.key);
          
          return (
            <div key={module.key} style={{ marginBottom: '12px' }}>
              {/* Module Title */}
              <div 
                style={{
                  color: '#FFD700',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '8px 12px',
                  background: 'rgba(255,215,0,0.15)',
                  borderRadius: '6px',
                  borderLeft: '3px solid #FFD700',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  border: '1px solid rgba(255,215,0,0.3)'
                }}
              >
                {module.icon} {!collapsed && <span style={{ marginLeft: '8px' }}>{module.title}</span>}
              </div>
              
              {/* Module Menu Items - ALWAYS SHOW ALL PAGES */}
              {!collapsed && moduleMenuItems && moduleMenuItems.length > 0 && (
                <div style={{ 
                  marginLeft: '4px', 
                  marginBottom: '8px',
                  background: 'rgba(255,215,0,0.05)',
                  borderRadius: '4px',
                  padding: '4px 0'
                }}>
                  <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                    onClick={handleMenuClick}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '12px'
                    }}
                    items={moduleMenuItems}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Section */}
      {!collapsed && (
                <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
        }}>
                            <Text style={{ color: '#0f172a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                MoH Uganda IMS
            </Text>
            <br />
            <Text style={{ color: '#cbd5e1', fontSize: '8px', opacity: 0.5, position: 'absolute', bottom: '10px', left: '10px' }}>
                v2.0.0
            </Text>
        </div>
      )}
    </Sider>
  );
};

export default AppSidebar;
