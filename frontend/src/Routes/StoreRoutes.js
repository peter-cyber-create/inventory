import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Import the 5 main stores modules
import GRN from '../pages/Stores/GRN';
import Ledger from '../pages/Stores/Ledger';
import Form76A from '../pages/Stores/Form76A';  // Requisitions/Issuance (Form 76A)
import Reports from '../pages/Stores/Reports';
import StoresDashboard from '../pages/Stores/Dashboard';  // Updated dashboard

// Legacy components for backward compatibility
import LegacyStoresDashboard from '../pages/Stores/StoresDashboard';
import ItemsManagement from '../pages/Stores/ItemsManagement';
import SuppliersManagement from '../pages/Stores/SuppliersManagement';
import LocationsManagement from '../pages/Stores/LocationsManagement';
import ReceivingGoods from '../pages/Stores/ReceivingGoods';
import StockBalance from '../pages/Stores/StockBalance';
import Returns from '../pages/Stores/Returns';
import Adjustments from '../pages/Stores/Adjustments';

const StoreRoutes = () => {
  return (
    <>
      {/* Main 5 Stores Modules */}
      <ProtectedRoute exact path="/stores" component={StoresDashboard} allowedRoles={['store', 'admin']} />
      <ProtectedRoute exact path="/stores/dashboard" component={StoresDashboard} allowedRoles={['store', 'admin']} />
      <Route exact path="/stores/grn" component={GRN} />
      <Route exact path="/stores/ledger" component={Ledger} />
      <Route exact path="/stores/requisitions-issuance" component={Form76A} />
      <Route exact path="/stores/form76a" component={Form76A} />
      <Route exact path="/stores/reports" component={Reports} />
      
      {/* Legacy routes for backward compatibility */}
      <Route exact path="/stores/items" component={ItemsManagement} />
      <Route exact path="/stores/suppliers" component={SuppliersManagement} />
      <Route exact path="/stores/locations" component={LocationsManagement} />
      <Route exact path="/stores/receiving" component={ReceivingGoods} />
      <Route exact path="/stores/balance" component={StockBalance} />
      <Route exact path="/stores/returns" component={Returns} />
      <Route exact path="/stores/adjustments" component={Adjustments} />
    </>
  );
};

export default StoreRoutes;