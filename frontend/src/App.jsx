import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './modules/dashboard/Dashboard';
import IctDashboard from './modules/ict/IctDashboard';
import IctAssets from './modules/ict/IctAssets';
import IctAssetDetails from './modules/ict/IctAssetDetails.jsx';
import AddAssetBulk from './modules/ict/assetsInventory/AddAsset.jsx';
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
import ActivityCreate from './modules/finance/Activity/index.jsx';
import ActivitiesListing from './modules/finance/Activities/index.jsx';
import UpdateActivity from './modules/finance/Activity/UpdateActivity.jsx';
import ActivityDetails from './modules/finance/Activity/ActivityDetails.jsx';
import ActivityParticipants from './modules/finance/Activity/ActivityParticipants.jsx';
import AdminUsers from './modules/admin/AdminUsers';
import AdminRoles from './modules/admin/AdminRoles';
import AdminDepartments from './modules/admin/AdminDepartments';
import AdminSettings from './modules/admin/AdminSettings';
import AdminReports from './modules/admin/AdminReports';
import FinanceUsers from './modules/finance/Users/index.jsx';
import ActivitiesByDate from './modules/finance/Reports/ActivitiesByDate.jsx';
import ActivitiesByFunding from './modules/finance/Reports/ActivitiesByFunding.jsx';
import ActivitiesPerPerson from './modules/finance/Reports/ActivitiesPerPerson.jsx';
import PendingAccountability from './modules/finance/Reports/PendingAccountability.jsx';
import FlaggedUsers from './modules/finance/Reports/Flaggedusers.jsx';
import ActivityPerParticipant from './modules/finance/Reports/ActivityPerParticipant.jsx';
import UsersAmount from './modules/finance/Reports/UsersAmount.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ict/dashboard" element={<IctDashboard />} />
        <Route path="ict/assets" element={<IctAssets />} />
        <Route path="ict/assets/add" element={<AddAssetBulk />} />
        <Route path="ict/assets/:id" element={<IctAssetDetails />} />
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
        {/* Legacy route pointing to listing for backward compatibility */}
        <Route path="finance/activities" element={<ActivitiesListing />} />
        {/* Finance activities module */}
        <Route path="activities/add" element={<ActivityCreate />} />
        <Route path="activities/listing" element={<ActivitiesListing />} />
        <Route path="activities/update/:id" element={<UpdateActivity />} />
        <Route path="activities/participants/:id" element={<ActivityParticipants />} />
        <Route path="activities/:id" element={<ActivityDetails />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/roles" element={<AdminRoles />} />
        <Route path="admin/departments" element={<AdminDepartments />} />
        <Route path="admin/settings" element={<AdminSettings />} />
        <Route path="admin/reports" element={<AdminReports />} />
        {/* Finance users */}
        <Route path="finance/users" element={<FinanceUsers />} />
        {/* Finance reports */}
        <Route path="report/activities" element={<ActivitiesByDate />} />
        <Route path="report/funding" element={<ActivitiesByFunding />} />
        <Route path="report/person" element={<ActivitiesPerPerson />} />
        <Route path="report/accountability" element={<PendingAccountability />} />
        <Route path="report/flagged" element={<FlaggedUsers />} />
        <Route path="report/participant/activity" element={<ActivityPerParticipant />} />
        <Route path="report/user/amounts" element={<UsersAmount />} />
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
