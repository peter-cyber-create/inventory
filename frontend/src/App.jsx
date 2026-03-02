import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './modules/dashboard/Dashboard';
import IctDashboard from './modules/ict/IctDashboard';
import IctAssets from './modules/ict/IctAssets';
import IctMaintenance from './modules/ict/IctMaintenance';
import IctRequisitions from './modules/ict/IctRequisitions';
import IctIssues from './modules/ict/IctIssues';
import IctServers from './modules/ict/IctServers';
import FleetDashboard from './modules/fleet/FleetDashboard';
import FleetVehicles from './modules/fleet/FleetVehicles';
import FleetSpareParts from './modules/fleet/FleetSpareParts';
import FleetRequisitions from './modules/fleet/FleetRequisitions';
import FleetReceiving from './modules/fleet/FleetReceiving';
import FleetJobCards from './modules/fleet/FleetJobCards';
import StoresDashboard from './modules/stores/StoresDashboard';
import StoresItems from './modules/stores/StoresItems';
import StoresGRN from './modules/stores/StoresGRN';
import StoresLedger from './modules/stores/StoresLedger';
import StoresRequisitions from './modules/stores/StoresRequisitions';
import StoresIssues from './modules/stores/StoresIssues';
import FinanceDashboard from './modules/finance/FinanceDashboard';
import FinanceActivities from './modules/finance/FinanceActivities';
import AdminUsers from './modules/admin/AdminUsers';
import AdminRoles from './modules/admin/AdminRoles';
import AdminDepartments from './modules/admin/AdminDepartments';
import AdminSettings from './modules/admin/AdminSettings';
import AdminReports from './modules/admin/AdminReports';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ict/dashboard" element={<IctDashboard />} />
        <Route path="ict/assets" element={<IctAssets />} />
        <Route path="ict/maintenance" element={<IctMaintenance />} />
        <Route path="ict/requisitions" element={<IctRequisitions />} />
        <Route path="ict/issues" element={<IctIssues />} />
        <Route path="ict/servers" element={<IctServers />} />
        <Route path="fleet/dashboard" element={<FleetDashboard />} />
        <Route path="fleet/vehicles" element={<FleetVehicles />} />
        <Route path="fleet/spare-parts" element={<FleetSpareParts />} />
        <Route path="fleet/requisitions" element={<FleetRequisitions />} />
        <Route path="fleet/receiving" element={<FleetReceiving />} />
        <Route path="fleet/job-cards" element={<FleetJobCards />} />
        <Route path="stores/dashboard" element={<StoresDashboard />} />
        <Route path="stores/items" element={<StoresItems />} />
        <Route path="stores/grn" element={<StoresGRN />} />
        <Route path="stores/ledger" element={<StoresLedger />} />
        <Route path="stores/requisitions" element={<StoresRequisitions />} />
        <Route path="stores/issues" element={<StoresIssues />} />
        <Route path="finance/dashboard" element={<FinanceDashboard />} />
        <Route path="finance/activities" element={<FinanceActivities />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/roles" element={<AdminRoles />} />
        <Route path="admin/departments" element={<AdminDepartments />} />
        <Route path="admin/settings" element={<AdminSettings />} />
        <Route path="admin/reports" element={<AdminReports />} />
        <Route path="*" element={
          <div className="p-6">
            <h1 className="text-page-title text-gov-primary mb-2">Page not found</h1>
            <p className="text-body text-gov-secondary mb-4">The requested page could not be found.</p>
            <p className="text-body-sm text-gov-secondaryMuted mb-2">If you opened a link or refreshed, the server may not be configured to serve the app for this path. Try opening the site from the home URL and use the sidebar to navigate.</p>
            <Link to="/" className="ims-btn-primary inline-block">Go to Dashboard</Link>
          </div>
        } />
      </Route>
    </Routes>
  );
}
