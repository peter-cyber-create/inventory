import React from 'react';
import { Route } from 'react-router-dom';

// Import actual components
import Requisitions from '../pages/Stores/Requisitions';
import Form76A from '../pages/Stores/Form76A';

// Placeholder components for store routes
const StoresDashboard = () => (
  <div style={{ padding: '20px' }}>
    <h2>Stores Dashboard</h2>
    <p>Stores module is being developed. This is a placeholder page.</p>
  </div>
);

const ItemsManagement = () => (
  <div style={{ padding: '20px' }}>
    <h2>Items Management</h2>
    <p>Items management module is being developed. This is a placeholder page.</p>
  </div>
);

const SuppliersManagement = () => (
  <div style={{ padding: '20px' }}>
    <h2>Suppliers Management</h2>
    <p>Suppliers management module is being developed. This is a placeholder page.</p>
  </div>
);

const LocationsManagement = () => (
  <div style={{ padding: '20px' }}>
    <h2>Locations Management</h2>
    <p>Locations management module is being developed. This is a placeholder page.</p>
  </div>
);

const ReceivingGoods = () => (
  <div style={{ padding: '20px' }}>
    <h2>Receiving Goods</h2>
    <p>Receiving goods module is being developed. This is a placeholder page.</p>
  </div>
);

const StockLedger = () => (
  <div style={{ padding: '20px' }}>
    <h2>Stock Ledger</h2>
    <p>Stock ledger module is being developed. This is a placeholder page.</p>
  </div>
);

const Requisitions = () => (
  <div style={{ padding: '20px' }}>
    <h2>Requisitions</h2>
    <p>Requisitions module is being developed. This is a placeholder page.</p>
  </div>
);

const Issuances = () => (
  <div style={{ padding: '20px' }}>
    <h2>Issuances</h2>
    <p>Issuances module is being developed. This is a placeholder page.</p>
  </div>
);

const StockBalance = () => (
  <div style={{ padding: '20px' }}>
    <h2>Stock Balance</h2>
    <p>Stock balance module is being developed. This is a placeholder page.</p>
  </div>
);

const Returns = () => (
  <div style={{ padding: '20px' }}>
    <h2>Returns</h2>
    <p>Returns module is being developed. This is a placeholder page.</p>
  </div>
);

const Adjustments = () => (
  <div style={{ padding: '20px' }}>
    <h2>Adjustments</h2>
    <p>Adjustments module is being developed. This is a placeholder page.</p>
  </div>
);

const StoresRequisitionFormPage = () => (
  <div style={{ padding: '20px' }}>
    <h2>Requisition Form</h2>
    <p>Requisition form module is being developed. This is a placeholder page.</p>
  </div>
);

const StoresReports = () => (
  <div style={{ padding: '20px' }}>
    <h2>Stores Reports</h2>
    <p>Stores reports module is being developed. This is a placeholder page.</p>
  </div>
);

const StoreRoutes = () => {
  return (
    <>
      <Route exact path="/stores" component={StoresDashboard} />
      <Route exact path="/stores/items" component={ItemsManagement} />
      <Route exact path="/stores/suppliers" component={SuppliersManagement} />
      <Route exact path="/stores/locations" component={LocationsManagement} />
      <Route exact path="/stores/receiving" component={ReceivingGoods} />
      <Route exact path="/stores/ledger" component={StockLedger} />
      <Route exact path="/stores/requisitions" component={Requisitions} />
      <Route exact path="/stores/form76a" component={Form76A} />
      <Route exact path="/stores/issuances" component={Issuances} />
      <Route exact path="/stores/balance" component={StockBalance} />
      <Route exact path="/stores/returns" component={Returns} />
      <Route exact path="/stores/adjustments" component={Adjustments} />
      <Route exact path="/stores/requisition-form" component={StoresRequisitionFormPage} />
      <Route exact path="/stores/reports" component={StoresReports} />
    </>
  );
};

export default StoreRoutes;
