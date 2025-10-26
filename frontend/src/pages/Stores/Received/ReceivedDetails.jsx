import React from 'react'

const ReceivedDetails = ({ items }) => {
    return (
        <div class="tab-pane active" >
            <div className="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered border-primary mb-0 stripped">
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#f2f2f2' }}>Product</th>
                                            <th style={{ backgroundColor: '#f2f2f2' }}>Unit</th>
                                            <th style={{ backgroundColor: '#f2f2f2' }}>Quantity Received</th>
                                            <th style={{ backgroundColor: '#f2f2f2' }}>Rate</th>
                                            <th style={{ backgroundColor: '#f2f2f2' }}>Invoice Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.product}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.qty}</td>
                                                <td>{item.rate}</td>
                                                <td>{item.invoiceValue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReceivedDetails