import React from 'react';
import { Route } from 'react-router-dom';

// Import the 5 main stores modules
import GRN from '../pages/Stores/GRN';
import Ledger from '../pages/Stores/Ledger';
import Issuance from '../pages/Stores/Issuance';
import Requisition from '../pages/Stores/Requisition';
import Reports from '../pages/Stores/Reports';

// Legacy components for backward compatibility
import StoresDashboard from '../pages/Stores/StoresDashboard';
import ItemsManagement from '../pages/Stores/ItemsManagement';
import SuppliersManagement from '../pages/Stores/SuppliersManagement';
import LocationsManagement from '../pages/Stores/LocationsManagement';
import ReceivingGoods from '../pages/Stores/ReceivingGoods';
import StockLedger from '../pages/Stores/StockLedger';
import StockBalance from '../pages/Stores/StockBalance';
import Returns from '../pages/Stores/Returns';
import Adjustments from '../pages/Stores/Adjustments';
import StoresReports from '../pages/Stores/StoresReports';

const StoreRoutes = () => {
  return (
    <>
      {/* Main 5 Stores Modules */}
      <Route exact path="/stores" component={StoresDashboard} />
      <Route exact path="/stores/grn" component={GRN} />
      <Route exact path="/stores/ledger" component={Ledger} />
      <Route exact path="/stores/issuance" component={Issuance} />
      <Route exact path="/stores/requisition" component={Requisition} />
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