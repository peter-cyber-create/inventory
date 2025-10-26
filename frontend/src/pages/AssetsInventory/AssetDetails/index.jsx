import React, { useState, useEffect, Fragment } from "react";
import API from "../../../helpers/api";
import AssetInfo from "./AssetInfo";
import AssignedUser from "./AssignedUser";
import Transfer from "./TransferHistory";
import Maintenance from "./Maintenance";
import Disposal from "./Disposal";
import AuditHistory from "./AuditHistory";

const AssetDetails = ({ match }) => {
    const [asset, setAsset] = useState({})
    const [loading, setLoading] = useState(false)

    const { id } = match.params;

    const getAsset = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/assets/${id}`);
            console.log(res)
            setLoading(false);
            setAsset(res.data.asset);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAsset();
    }, []);

    return (
        <Fragment>
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="font-size-18">Asset Serial Number: {asset.serialNo} & Engraved Number: {asset.engravedNo}</h4>
                        {/* <div class="page-title-right">
                            <ol class="breadcrumb m-0">
                                <li class="breadcrumb-item"><a href="javascript: void(0);">Crypto</a></li>
                                <li class="breadcrumb-item active">Orders</li>
                            </ol>
                        </div> */}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title mb-3">Asset Details</h4>
                            <ul class="nav nav-tabs nav-tabs-custom" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link active" data-bs-toggle="tab" href="#asset-info" role="tab" aria-selected="true">
                                        Asset Info
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" data-bs-toggle="tab" href="#user" role="tab" aria-selected="false" tabindex="-1">
                                        Assigned User
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" data-bs-toggle="tab" href="#movement" role="tab" aria-selected="false" tabindex="-1">
                                        Asset Tranfer History
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" data-bs-toggle="tab" href="#maintenance" role="tab" aria-selected="false" tabindex="-1">
                                        Preventive Maintenance
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" data-bs-toggle="tab" href="#disposal" role="tab" aria-selected="false" tabindex="-1">
                                        Asset Disposal
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" data-bs-toggle="tab" href="#history" role="tab" aria-selected="false" tabindex="-1">
                                        Asset Audit History
                                    </a>
                                </li>
                            </ul>
                            <div class="tab-content p-3">
                                <AssetInfo asset={asset} />
                                <AssignedUser id={id} />
                                <Transfer id={id} />
                                <Maintenance id={id} />
                                <Disposal id={id} />
                                <AuditHistory id={id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AssetDetails