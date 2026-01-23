import React, { useState } from 'react';
import API from '../../../helpers/api';
import { toast } from 'react-toastify';

const ActivitiesByDate = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/reports/date', {
                params: filters
            });
            setActivities(response.data.activities);
        } catch (error) {
            toast.error('Failed to fetch activities');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Activities by Date Range</h2>
            
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={filters.startDate}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={filters.endDate}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))}
                            />
                        </div>
                        <div className="col-md-4">
                            <button 
                                className="btn btn-primary"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Activity Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Amount</th>
                                    <th>Participants</th>
                                    <th>Funder</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map(activity => (
                                    <tr key={activity.id}>
                                        <td>{activity.activityName}</td>
                                        <td>{new Date(activity.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(activity.endDate).toLocaleDateString()}</td>
                                        <td>{activity.amt}</td>
                                        <td>{activity.participants?.length || 0}</td>
                                        <td>{activity.funder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesByDate;