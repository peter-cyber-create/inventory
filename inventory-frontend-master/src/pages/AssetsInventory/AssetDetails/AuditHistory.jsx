import React, { useState, useEffect } from 'react'
import API from "../../../helpers/api";
import FNSpinner from '../../../components/FNSpinner'
import FNTable from '../../../components/FNTable';

const AuditHistory = ({id}) => {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState([]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/audit/${id}`);
            setHistory(res.data.audit);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const tableColumns = [
        { key: 'createdAt', label: 'Date' },
        { key: 'action', label: 'Action' },
        { key: 'description', label: 'Description' },
        { key: 'actionedBy', label: 'Actioned By' },
    ];

    return (
        <div class="tab-pane" id="history" role="tabpanel">
            <div class="card">
                <div class="card-body">
                    <FNTable columns={tableColumns} data={history} />
                </div>
            </div>
        </div>
    )
}

export default AuditHistory