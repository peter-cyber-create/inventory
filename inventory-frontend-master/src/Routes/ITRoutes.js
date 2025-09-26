import React from 'react';
import { Route } from "react-router-dom";
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard'
import AssetsInventoryDashboard from '../pages/AssetsInventory/Dashboard';
import Maintanance from '../pages/AssetsInventory/Maintanance';
import DataImport from '../pages/DataImport';
import AssetsInventory from '../pages/AssetsInventory';
import Servers from '../pages/AssetsInventory/Servers';
import VirtualServers from '../pages/AssetsInventory/VirtualServers';
import AssetDetails from '../pages/AssetsInventory/AssetDetails';
import Categories from '../pages/AssetsInventory/Admin/Categories';
import Brands from '../pages/AssetsInventory/Admin/Brands';
import Models from '../pages/AssetsInventory/Admin/Models';
import Inventory from '../pages/AssetsInventory/Inventory';
import Types from '../pages/AssetsInventory/Admin/Types';
import Depts from '../pages/AssetsInventory/Admin/Depts';
import Divisions from '../pages/AssetsInventory/Admin/Divisions';
import Staff from '../pages/AssetsInventory/Admin/Staff';
import Facilities from '../pages/AssetsInventory/Admin/Facilities';
import Requisition from '../pages/AssetsInventory/Requisition';
import Issue from '../pages/AssetsInventory/Issue';
import ReportInventory from '../pages/AssetsInventory/Reports/inventory';
import Transfers from '../pages/AssetsInventory/Reports/transfers';
import Users from '../pages/AssetsInventory/Reports/users';
import Disposal from '../pages/AssetsInventory/Reports/disposal';
import ReportMaintanance from '../pages/AssetsInventory/Reports/maintanance';
import AdminUsers from '../pages/AssetsInventory/Admin/Users';

const ITRoutes = () => {
    return (
        <>
            <ProtectedRoute exact path="/ict/dashboard" component={Dashboard} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/assets/dashboard" component={AssetsInventoryDashboard} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/assets" component={AssetsInventory} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/assets/:id" component={AssetDetails} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/maintanance" component={Maintanance} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/dataimport" component={DataImport} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/servers" component={Servers} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/servers/virtual" component={VirtualServers} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/categories" component={Categories} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/brands" component={Brands} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/models" component={Models} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/types" component={Types} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/departments" component={Depts} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/facilities" component={Facilities} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/divisions" component={Divisions} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/staff" component={Staff} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/users" component={AdminUsers} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/issue" component={Issue} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/inventory" component={Inventory} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/requisition" component={Requisition} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/reports/inventory" component={ReportInventory} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/reports/users" component={Users} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/reports/transfers" component={Transfers} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/reports/maintenance" component={ReportMaintanance} allowedRoles={['it', 'admin']} />
            <ProtectedRoute exact path="/ict/reports/disposal" component={Disposal} allowedRoles={['it', 'admin']} />
        </>
    );
};

export default ITRoutes;
