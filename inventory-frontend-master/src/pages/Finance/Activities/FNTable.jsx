/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import moment from 'moment';
import '../../../assets/css/gou-moh-theme.css';


const FTable = ({ data, onViewDetails, handleEdit, handleDelete }) => {

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending_accountability':
                return <span className="badge bg-danger">Pending Accountability</span>;
            case 'activity_closed':
                return <span className="badge bg-success">Activity Closed</span>;
            default:
                return <span>{status}</span>;
        }
    };


    return (
        <div className="gou-card gou-shadow gou-radius" style={{ overflowX: 'auto' }}>
            <table className="gou-table">
                <thead>
                    <tr>
                        <th>Activity Name</th>
                        <th>Requested By</th>
                        <th>User Department</th>
                        <th>Invoice Date</th>
                        <th>Voucher Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.activityName}</td>
                            <td>{item.requested_by}</td>
                            <td>{item.dept}</td>
                            <td>{moment(item.invoiceDate).format('YYYY-MM-DD')}</td>
                            <td>{item.vocherno}</td>
                            <td>{getStatusBadge(item.status)}</td>
                            <td>
                                {item.status !== 'activity_closed' && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => onViewDetails(item.id)}
                                            className="gou-btn"
                                            style={{ background: 'var(--gou-green)' }}
                                            aria-label="View details"
                                        >
                                            <i className="mdi mdi-eye-outline" style={{ fontSize: 20, marginRight: 6 }}></i>View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="gou-btn"
                                            style={{ background: 'var(--gou-maroon)' }}
                                            aria-label="Edit"
                                        >
                                            <i className="mdi mdi-comment-edit-outline" style={{ fontSize: 20, marginRight: 6 }}></i>Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if(window.confirm('Are you sure you want to delete this item?')) handleDelete(item.id);
                                            }}
                                            className="gou-btn"
                                            style={{ background: 'var(--gou-black)' }}
                                            aria-label="Delete"
                                        >
                                            <i className="mdi mdi-trash-can" style={{ fontSize: 20, marginRight: 6 }}></i>Delete
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FTable