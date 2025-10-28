import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/Admin/Dashboard';
import UserManagement from '../pages/Admin/UserManagement';
import RolesPermissions from '../pages/Admin/RolesPermissions';
import SystemSettings from '../pages/Admin/SystemSettings';
import SystemReports from '../pages/Admin/SystemReports';
import ModuleReports from '../pages/Admin/ModuleReports';

const AdminRoutes = () => {
    return (
        <>
            <ProtectedRoute exact path="/admin/dashboard" component={AdminDashboard} allowedRoles={['admin']} />
            <ProtectedRoute exact path="/admin/users" component={UserManagement} allowedRoles={['admin']} />
            <ProtectedRoute exact path="/admin/roles" component={RolesPermissions} allowedRoles={['admin']} />
            <ProtectedRoute exact path="/admin/settings" component={SystemSettings} allowedRoles={['admin']} />
            <ProtectedRoute exact path="/admin/reports/overview" component={SystemReports} allowedRoles={['admin']} />
            <ProtectedRoute exact path="/admin/reports/modules" component={ModuleReports} allowedRoles={['admin']} />
        </>
    );
};

export default AdminRoutes;
