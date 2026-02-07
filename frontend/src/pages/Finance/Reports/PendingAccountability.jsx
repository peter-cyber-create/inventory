import { NumericFormat as NumberFormat } from 'react-number-format';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../../../helpers/api';
import { toast } from 'react-toastify';

const PendingAccountability = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const history = useHistory();

    useEffect(() => {
        fetchPendingActivities();
    }, []);

    const fetchPendingActivities = async () => {
        try {
            const response = await API.get('/api/reports/accountability');
            // Defensively normalize: ensure we always have an array
            const activitiesList = Array.isArray(response?.data?.activities) 
                ? response.data.activities 
                : Array.isArray(response?.data) 
                    ? response.data 
                    : [];
            setActivities(activitiesList);
        } catch (error) {
            toast.error('Failed to fetch pending activities');
            // On error, set empty array to prevent .map() crashes
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const viewDetails = (id) => {
        history.push(`/activities/participants/${id}`);
    };

    return (
        <div className="container mt-4">
            <h2>Pending Accountability Reports</h2>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Activity Name</th>
                                    <th>Requested By</th>
                                    <th>Source of Funding</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                    <th>Days Since End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(activities) && activities.map(activity => {
                                    const daysSinceEnd = Math.floor(
                                        (new Date() - new Date(activity.endDate)) / (1000 * 60 * 60 * 24)
                                    );

                                    return (
                                        <tr key={activity.id} className={daysSinceEnd > 30 ? 'table-danger' : ''}>
                                            <td>{activity.activityName}</td>
                                            <td>{activity.user && activity.requested_by}</td>
                                            <td>{activity.funder}</td>
                                            <td>{new Date(activity.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(activity.endDate).toLocaleDateString()}</td>
                                            <td><NumberFormat
                                                value={activity.amt}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                            /></td>

                                            {/* <td>
                                                <ul className="list-unstyled mb-0">
                                                    {activity.participants.map(p => (
                                                        <li key={p.id}>{p.name} ({p.email})</li>
                                                    ))}
                                                </ul>
                                            </td> */}
                                            <td>
                                                <span className={daysSinceEnd > 30 ? 'text-danger' : ''}>
                                                    {daysSinceEnd} days
                                                </span>
                                            </td>
                                            <td>
                                                <div class="d-inline-block me-2">
                                                    <a onClick={() => viewDetails(activity.id)} class="btn btn-warning btn-sm">View</a>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingAccountability;