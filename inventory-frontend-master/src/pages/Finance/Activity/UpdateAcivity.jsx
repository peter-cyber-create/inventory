import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from "../../../helpers/api";
import { toast } from 'react-toastify';

const UpdateActivity = () => {
    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activity, setActivity] = useState({
        activityName: '',
        dept: '',
        invoiceDate: '',
        vocherno: '',
        days: '',
        amt: '',
        funder: '',
        status: ''
    });
    const [participants, setParticipants] = useState([]);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        title: '',
        phone: '',
        amount: '',
        days: ''
    });

    const user = JSON.parse(localStorage.getItem("user"))

    // Fetch activity and participants data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [activityRes, participantsRes] = await Promise.all([
                    API.get(`/activity/${id}`),
                    API.get(`/activity/participants/${id}`)
                ]);

                // Format the date to YYYY-MM-DD for the input field
                const activity = activityRes.data.activity;
                if (activity.invoiceDate) {
                    activity.invoiceDate = new Date(activity.invoiceDate).toISOString().split('T')[0];
                }

                setActivity(activity);
                setParticipants(participantsRes.data.participants);
            } catch (error) {
                toast.error('Failed to fetch activity data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Handle activity details change
    const handleActivityChange = (e) => {
        const { name, value } = e.target;
        setActivity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle new participant form change
    const handleNewParticipantChange = (e) => {
        const { name, value } = e.target;
        setNewParticipant(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add new participant
    const handleAddParticipant = () => {
        // Validate required fields
        if (!newParticipant.name || !newParticipant.email) {
            toast.warning('Name and email are required');
            return;
        }

        setParticipants(prev => [...prev, { ...newParticipant, id: Date.now() }]);
        setNewParticipant({
            name: '',
            title: '',
            phone: '',
            amount: '',
            days: ''
        });
    };

    // Remove participant
    const handleRemoveParticipant = async (participantId) => {
        try {
            await API.delete(`/activity/participant/${participantId}`);
            setParticipants(prev => prev.filter(p => p.id !== participantId));
            toast.success('Participant removed successfully');
        } catch (error) {
            toast.error('Failed to remove participant');
            console.error(error);
        }
    };

    // Submit updates
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Update activity details
            await API.patch(`/activity/${id}`, activity);

            // Update participants
            await API.post(`/activity/${id}/participants`, {
                participants: participants
            });

            toast.success('Activity updated successfully');
            history.push(`/activities/listing`);
        } catch (error) {
            toast.error('Failed to update activity');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete activity
    const handleDelete = async () => {
        try {
            setLoading(true);
            await API.delete(`/activity/${id}`);

            toast.success('Activity deleted successfully');
            setShowDeleteModal(false);
            history.push('/activities/listing');

        } catch (error) {
            console.error('Delete error:', error);
            toast.error(
                error.response?.data?.message ||
                'Failed to delete activity. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Update Activity</h2>
            <form onSubmit={handleSubmit}>
                {/* Activity Details Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Activity Details</h4>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Activity Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="activityName"
                                    value={activity.activityName}
                                    onChange={handleActivityChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Department</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="dept"
                                    value={activity.dept}
                                    onChange={handleActivityChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Invoice Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="invoiceDate"
                                    value={activity.invoiceDate}
                                    onChange={handleActivityChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Vocher Number</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="vocherno"
                                    value={activity.vocherno}
                                    onChange={handleActivityChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="amt"
                                    value={activity.amt}
                                    onChange={handleActivityChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={activity.status}
                                    onChange={handleActivityChange}
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                    <option value="report_submitted">Report Submiited</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Participants</h4>

                        {/* Existing Participants Table */}
                        <div className="table-responsive mb-4">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Title</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Amount</th>
                                        <th>Days</th>
                                        {user && user.module === 'GOU' &&
                                            <th>Actions</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map((participant) => (
                                        <tr key={participant.id}>
                                            <td>{participant.name}</td>
                                            <td>{participant.title}</td>
                                            <td>{participant.email}</td>
                                            <td>{participant.phone}</td>
                                            <td>{participant.amount}</td>
                                            <td>{participant.days}</td>

                                            {user && user.module === 'GOU' &&
                                                <li className="nav-item dropdown">
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleRemoveParticipant(participant.id)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </li>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add New Participant Form */}
                        {user && user.module === 'GOU' &&
                            <div className="row">
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Name"
                                        name="name"
                                        value={newParticipant.name}
                                        onChange={handleNewParticipantChange}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Title"
                                        name="title"
                                        value={newParticipant.title}
                                        onChange={handleNewParticipantChange}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        name="email"
                                        value={newParticipant.email}
                                        onChange={handleNewParticipantChange}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="Phone"
                                        name="phone"
                                        value={newParticipant.phone}
                                        onChange={handleNewParticipantChange}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Amount"
                                        name="amount"
                                        value={newParticipant.amount}
                                        onChange={handleNewParticipantChange}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Days"
                                        name="days"
                                        value={newParticipant.days}
                                        onChange={handleNewParticipantChange}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddParticipant}
                                    >
                                        Add Participant
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {/* Submit and Delete Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
                    <button
                        type="submit"
                        className="btn btn-success btn-lg me-md-2"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Activity'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-lg"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={loading}
                    >
                        Delete Activity
                    </button>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
                    <div
                        className="modal fade show"
                        style={{
                            display: 'block',
                            zIndex: 1050,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDeleteModal(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UpdateActivity;