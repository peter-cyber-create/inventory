import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import FinanceDashboard from '../pages/Finance/Dashboard';
import Activity from '../pages/Finance/Activity';
import Activities from '../pages/Finance/Activities';
import FlaggedUsers from '../pages/Finance/Reports/Flaggedusers';
import ActivityDetails from '../pages/Finance/Activity/ActivityDetails';
import UpdateActivity from '../pages/Finance/Activity/UpdateAcivity';
import ActivitiesByDate from '../pages/Finance/Reports/ActivitiesByDate';
import ActivitiesByFunding from '../pages/Finance/Reports/ActivitiesByFunding';
import ActivitiesPerPerson from '../pages/Finance/Reports/ActivitiesPerPerson';
import ActivityPerParticipant from '../pages/Finance/Reports/ActivityPerParticipant';
import PendingAccountability from '../pages/Finance/Reports/PendingAccountability';
import Users from '../pages/Finance/Users';
import UsersAmount from '../pages/Finance/Reports/UsersAmount';

const ACtivityRoutes = () => {
    return (
        <>
            <ProtectedRoute exact path="/finance/dashboard" component={FinanceDashboard} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/activities/add" component={Activity} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/activities/listing" component={Activities} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/activities/update/:id" component={UpdateActivity} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/activities/participants/:id" component={ActivityDetails} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/activities" component={ActivitiesByDate} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/funding" component={ActivitiesByFunding} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/person" component={ActivitiesPerPerson} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/accountability" component={PendingAccountability} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/participant/activity" component={ActivityPerParticipant} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/flagged" component={FlaggedUsers} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/report/user/amounts" component={UsersAmount} allowedRoles={['finance', 'admin']} />
            <ProtectedRoute exact path="/activities/users" component={Users} allowedRoles={['finance', 'admin']} />

        </>
    );
};

export default ACtivityRoutes;
