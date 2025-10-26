import React from 'react'

const AssetInfo = ({ asset }) => {
    return (
        <div class="tab-pane active" id="asset-info" role="tabpanel">
            <div className="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            {/* <h4 class="card-title">Table Border color</h4>
                                        <p class="card-title-desc">Add <code>.table-bordered</code> &amp; <code>.border-*</code> for colored borders on all sides of the table and cells.</p>     */}

                            <div class="table-responsive">
                                <table class="table table-bordered border-primary mb-0">

                                    <tbody>
                                        <tr>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Serial Number</th>
                                            <td>{asset ? asset.serialNo : ''}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Engraved No</th>
                                            <td>{asset ? asset.engravedNo : ''}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Order Number</th>
                                            <td>{asset ? asset.orderNo : ''}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Category</th>
                                            <td>{asset.category ? asset.category.name : ''}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Type</th>
                                            <td>{asset.type ? asset.type.name : ''}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Model</th>
                                            <td>{asset.model ? asset.model.name : ''}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Processor</th>
                                            <td>{asset.processor}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Memory</th>
                                            <td>{asset ? asset.memory : ''}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Storage</th>
                                            <td>{asset.storage}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Supplier</th>
                                            <td>{asset && asset.supplier}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Funding Source</th>
                                            <td>{asset && asset.funding}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Funder</th>
                                            <td>{asset && asset.funder}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Purchase Cost</th>
                                            <td>{asset && asset.purchaseCost}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Purchase Date</th>
                                            <td>{asset && asset.purchaseDate}</td>
                                            <th scope="row" style={{ backgroundColor: '#f2f2f2' }}>Warrantly</th>
                                            <td>{asset && asset.warrantly}</td>
                                        </tr>
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

export default AssetInfo