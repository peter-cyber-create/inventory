import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../../helpers/api';

const JobCardDetails = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [jobcard, setJobCard] = useState('');
    const [spareParts, setSpareParts] = useState([]);

    const { id } = match.params;

    const loadJobCard = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/v/jobcard/${id}`);
            setJobCard(res?.data.job)
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const loadSpareParts = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/v/jobcard/parts/${id}`);
            setSpareParts(res?.data.parts);
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpareParts();
        loadJobCard();
    }, []);

    return (
        <Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-b d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0 font-size-18">Vehicle Number Plate :</h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><Link to="/fleet/reports/jobcards">Back</Link></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <section className="mt-4">
                                <div class="table-responsive">
                                    <table class="table table-striped table-bordered border-secondary table-sm">
                                        <thead className="table-dark">
                                            <tr>
                                                <th width='600'>Description / Model</th>
                                                <th>Part No</th>
                                                <th>Serial No</th>
                                                <th>Qty</th>
                                                <th class="text-end">Unit Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {spareParts &&
                                                spareParts.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.item}</td>
                                                        <td>{item.partno}</td>
                                                        <td>{item.serialno}</td>
                                                        <td>{item.qty}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default JobCardDetails;
