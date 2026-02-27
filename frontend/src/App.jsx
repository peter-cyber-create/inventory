import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './modules/dashboard/Dashboard';
import IctAssets from './modules/ict/IctAssets';
import IctMaintenance from './modules/ict/IctMaintenance';
import IctRequisitions from './modules/ict/IctRequisitions';
import IctIssues from './modules/ict/IctIssues';
import IctServers from './modules/ict/IctServers';
import FleetVehicles from './modules/fleet/FleetVehicles';
import FleetSpareParts from './modules/fleet/FleetSpareParts';
import FleetRequisitions from './modules/fleet/FleetRequisitions';
import FleetReceiving from './modules/fleet/FleetReceiving';
import FleetJobCards from './modules/fleet/FleetJobCards';
import StoresItems from './modules/stores/StoresItems';
import StoresGRN from './modules/stores/StoresGRN';
import StoresLedger from './modules/stores/StoresLedger';
import StoresRequisitions from './modules/stores/StoresRequisitions';
import StoresIssues from './modules/stores/StoresIssues';
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
        <Route path="ict/assets" element={<IctAssets />} />
        <Route path="ict/maintenance" element={<IctMaintenance />} />
        <Route path="ict/requisitions" element={<IctRequisitions />} />
        <Route path="ict/issues" element={<IctIssues />} />
        <Route path="ict/servers" element={<IctServers />} />
        <Route path="fleet/vehicles" element={<FleetVehicles />} />
        <Route path="fleet/spare-parts" element={<FleetSpareParts />} />
        <Route path="fleet/requisitions" element={<FleetRequisitions />} />
        <Route path="fleet/receiving" element={<FleetReceiving />} />
        <Route path="fleet/job-cards" element={<FleetJobCards />} />
        <Route path="stores/items" element={<StoresItems />} />
        <Route path="stores/grn" element={<StoresGRN />} />
        <Route path="stores/ledger" element={<StoresLedger />} />
        <Route path="stores/requisitions" element={<StoresRequisitions />} />
        <Route path="stores/issues" element={<StoresIssues />} />
        <Route path="finance/activities" element={<FinanceActivities />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/roles" element={<AdminRoles />} />
        <Route path="admin/departments" element={<AdminDepartments />} />
        <Route path="admin/settings" element={<AdminSettings />} />
        <Route path="admin/reports" element={<AdminReports />} />
        <Route path="*" element={<div className="p-6 text-gov-slate">Page not found.</div>} />
      </Route>
    </Routes>
  );
}
