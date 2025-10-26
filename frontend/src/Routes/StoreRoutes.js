import React from 'react';
import { Route } from 'react-router-dom';

// Import the 5 main stores modules
import GRN from './GRN';
import Ledger from './Ledger';
import Issuance from './Issuance';
import Requisition from './Requisition';
import Reports from './Reports';

// Legacy components for backward compatibility
import StoresDashboard from './StoresDashboard';
import ItemsManagement from './ItemsManagement';
import SuppliersManagement from './SuppliersManagement';
import LocationsManagement from './LocationsManagement';
import ReceivingGoods from './ReceivingGoods';
import StockLedger from './StockLedger';
import StockBalance from './StockBalance';
import Returns from './Returns';
import Adjustments from './Adjustments';
import StoresReports from './StoresReports';

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