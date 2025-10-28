import React, { Fragment } from 'react'
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Landing from '../pages/Landing';
import Login from '../pages/Auth/Login';
import Settings from '../pages/Settings';
import Dashboard from '../pages/Dashboard';
import ITRoutes from './ITRoutes';
import FleetRoutes from './FleetRoutes';
import StoreRoutes from './StoreRoutes';
import ACtivityRoutes from './ActivityRoutes';
import AdminRoutes from './AdminRoutes';

const App = () => {
  return (
    <Fragment>
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/landing" component={Landing} />
        <Layout>
          <ProtectedRoute exact path="/dashboard" component={Dashboard} allowedRoles={['admin']} />
          <Route exact path="/settings" component={Settings} />
          <ITRoutes />
          <FleetRoutes />
          <StoreRoutes />
          <ACtivityRoutes />
          <AdminRoutes />
        </Layout>
      </Switch>
    </Fragment>
  )
}

export default App