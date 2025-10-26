import React, { useState, useEffect } from 'react'
import API from "../../../../helpers/api";

const PartsUsed = ({ id }) => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadJobCard = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/jobcards/parts/${id}`);
            setParts(res.data.parts);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobCard();
    }, []);

    return (

        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 className='mb-4'>Job Card Number : {id}</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered border-primary mb-0">
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2' }}>
                                    <th>Part Name</th>
                                    <th>Part No</th>
                                    <th>Specfification</th>
                                    <th>Qty Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parts &&
                                    parts.map((part) => (
                                        <tr>
                                            <td>{part.name}</td>
                                            <td>{part.partno}</td>
                                            <td>{part.specification}</td>
                                            <td>{part.qtyUsed}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartsUsed