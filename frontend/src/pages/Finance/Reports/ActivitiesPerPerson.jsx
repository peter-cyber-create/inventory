import React, { useState } from 'react';
import API from '../../../helpers/api';
import { toast } from 'react-toastify';

const ActivitiesPerPerson = () => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/reports/person', {
                params: { name: name }
            });
            setParticipants(response.data.participants);
        } catch (error) {
            toast.error('Failed to fetch participant activities');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Activities per Person</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <input
                                type="name"
                                className="form-control"
                                placeholder="Search by participant name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                    <th>Participant Name</th>
                                    <th>Title</th>
                                    <th>Activity Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Amount</th>
                                    <th>Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map(participant => (
                                    <tr key={`${participant.id}-${participant.id}`}>
                                        <td>{participant.name}</td>
                                        <td>{participant.title}</td>
                                        <td>{participant.activity && participant.activity.activityName}</td>
                                        <td>{new Date(participant.activity && participant.activity.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(participant.activity && participant.activity.endDate).toLocaleDateString()}</td>
                                        <td>{participant.amount}</td>
                                        <td>{participant.days}</td>
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

export default ActivitiesPerPerson;