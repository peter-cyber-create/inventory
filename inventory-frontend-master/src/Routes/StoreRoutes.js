import React from 'react';
import { Route } from "react-router-dom";
import ProtectedRoute from '../components/ProtectedRoute';
import StoresDashboard from '../pages/stores/StoresDashboard';
import ItemsManagement from '../pages/stores/ItemsManagement';
import SuppliersManagement from '../pages/stores/SuppliersManagement';
import LocationsManagement from '../pages/stores/LocationsManagement';
import ReceivingGoods from '../pages/stores/ReceivingGoods';
import StockLedger from '../pages/stores/StockLedger';
import Requisitions from '../pages/stores/Requisitions';
import Issuances from '../pages/stores/Issuances';
import StockBalance from '../pages/stores/StockBalance';
import Returns from '../pages/stores/Returns';
import Adjustments from '../pages/stores/Adjustments';

import StoresRequisitionFormPage from '../pages/stores/StoresRequisitionFormPage';
import StoresReports from '../pages/stores/StoresReports';

const StoreRoutes = () => {
    return (
        <>
            <ProtectedRoute exact path="/stores/dashboard" component={StoresDashboard} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/items" component={ItemsManagement} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/suppliers" component={SuppliersManagement} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/locations" component={LocationsManagement} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/receiving" component={ReceivingGoods} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/ledger" component={StockLedger} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/requisitions" component={Requisitions} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/requisition-form" component={StoresRequisitionFormPage} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/issuances" component={Issuances} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/stock-balance" component={StockBalance} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/returns" component={Returns} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/adjustments" component={Adjustments} allowedRoles={['store', 'admin']} />
            <ProtectedRoute exact path="/stores/reports" component={StoresReports} allowedRoles={['store', 'admin']} />
        </>
    );
};

export default StoreRoutes;
