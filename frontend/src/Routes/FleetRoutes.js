import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Vehicles from '../pages/Fleet/Vehicles';
import VehicleTypes from '../pages/Fleet/Settings/Type'
import VehicleMake from '../pages/Fleet/Settings/Make'
import VehicleDetails from '../pages/Fleet/Vehicles/Details';
import SpareParts from '../pages/Fleet/SpareParts';
import Drivers from '../pages/Fleet/Settings/Drivers';
import Garages from '../pages/Fleet/Settings/Garages';
import SpareCategory from '../pages/Fleet/Settings/Categories';
import Departments from '../pages/Fleet/Settings/Departments';
import FleetDashboard from '../pages/Fleet/Dashboard';
import Requistion from '../pages/Fleet/InHouse/Requistion';
import Receiving from '../pages/Fleet/InHouse/Receiving';
import Service from '../pages/Fleet/InHouse/JobCard/Service';
import ServiceHistory from '../pages/Fleet/Reports/ServiceHistory';
import NewJob from '../pages/Fleet/JobCard/NewJob';
import JobCardDetail from '../pages/Fleet/JobCard/JobCardDetails';
import EditJobCard from '../pages/Fleet/JobCard/EditJobCard';
import JobCardPage from '../pages/Fleet/JobCard';
// import Services from '../pages/Fleet/reports/services';
// import JobCards from '../pages/Fleet/reports/JobCards';
import AddRequistion from '../pages/Fleet/InHouse/Requistion/AddRequistion';
import AddReceiving from '../pages/Fleet/InHouse/Receiving/AddReceiving';
import RequisitionDetails from '../pages/Fleet/InHouse/Requistion/RequisitionDetails';
import EditGarageServicingForm from '../pages/Fleet/InHouse/Receiving/EditGarageReceive';
import EditRequisition from '../pages/Fleet/InHouse/Requistion/EditRequisition';
import ReqDetailsPage from '../pages/Fleet/InHouse/Receiving/ReqDetailsPage';

const FleetRoutes = () => {
    return (
        <>
            <ProtectedRoute exact path="/fleet/vehicles" component={Vehicles} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/vehicles/types" component={VehicleTypes} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/vehicles/make" component={VehicleMake} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/spareparts" component={SpareParts} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/masters/drivers" component={Drivers} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/masters/garages" component={Garages} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/masters/categories" component={SpareCategory} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/masters/departments" component={Departments} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/dashboard" component={FleetDashboard} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/vehicle/:id" component={VehicleDetails} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/requistion" component={Requistion} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/requistion/add" component={AddRequistion} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/requistion/:id" component={RequisitionDetails} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/requistion/edit/:id" component={EditRequisition} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/receiving" component={Receiving} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/receiving/create" component={AddReceiving} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/receiving/more/:id" component={ReqDetailsPage} allowedRoles={['garage', 'admin']} />       
            <ProtectedRoute exact path="/fleet/receiving/edit/:id" component={EditGarageServicingForm} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/service/:id" component={Service} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/jobcards" component={JobCardPage} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/jobcard" component={NewJob} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/jobcards/:id" component={JobCardDetail} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/jobcards/edit/:id" component={EditJobCard} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/reports/servicehistory" component={ServiceHistory} allowedRoles={['garage', 'admin']} />
            {/* <ProtectedRoute exact path="/fleet/reports/services" component={Services} allowedRoles={['garage', 'admin']} />
            <ProtectedRoute exact path="/fleet/reports/jobcards" component={JobCards} allowedRoles={['garage', 'admin']} /> */}
        </>
    );
};

export default FleetRoutes;
