import React from 'react'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';

const Landing = () => {

    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("user"))

    const checkICT = () => {
        if (user.role !== 'admin') {
            Swal.fire({
                title: 'No Access Rights!',
                text: 'You dont have Rights to View HQ ICT Inventory',
                icon: 'error',
                confirmButtonText: 'Cancel'
            })
        } else {
            history.push('/ict/dashboard')
        }
    }

    const checkGarage = () => {
        if (user.role !== 'garage') {
            Swal.fire({
                title: 'No Access Rights!',
                text: 'You dont have Rights to View Garage Inventory',
                icon: 'error',
                confirmButtonText: 'Cancel'
            })
        } else {
            history.push('/fleet/dashboard')
        }
    }

    const checkLand = () => {
        if (user.role !== 'land') {
            Swal.fire({
                title: 'No Access Rights!',
                text: 'You dont have Rights to View Land Inventory',
                icon: 'error',
                confirmButtonText: 'Cancel'
            })
        } else {
            history.push('/land/dashboard')
        }
    }

    const checkStores = () => {
        if (user.role !== 'store') {
            Swal.fire({
                title: 'No Access Rights!',
                text: 'You dont have Rights to View Stores Module',
                icon: 'error',
                confirmButtonText: 'Cancel'
            })
        } else {
            history.push('/stores/dashboard')
        }
    }
    
    const checkFacilityIT = () => {
        if (user.role !== 'facilityIT') {
            Swal.fire({
                title: 'No Access Rights!',
                text: 'You dont have Rights to View Facility IT Inventory',
                icon: 'error',
                confirmButtonText: 'Cancel'
            })
        } else {
            history.push('/stores/dashboard')
        }
    }

    return (
        <div className="p-5">
            <div class="row">
                <div class="col-lg-12">
                    <div class="d-flex">
                        <h2 class="mb-4 flex-grow-1">Select Inventory Module</h2>
                    </div>
                </div>
                <div class="col-lg-2" style={{ cursor: 'pointer' }}>
                    <div class="card" onClick={checkStores}>
                        <div class="card-body p-4">
                            <div class="text-center mb-3">
                                <img src="images/airbnb.svg" alt="" class="avatar-sm" />
                                <a href="#" class="text-body">
                                    <h5 class="mt-4 mb-2 font-size-15">Stores Module</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2" style={{ cursor: 'pointer' }}>
                    <div class="card" onClick={checkICT}>
                        <div class="card-body p-4">
                            <div class="text-center mb-3">
                                <img src="images/mailchimp.svg" alt="" class="avatar-sm" />
                                <a href="#" class="text-body">
                                    <h5 class="mt-4 mb-2 font-size-15">HQ IT Inventory</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2" style={{ cursor: 'pointer' }}>
                    <div class="card" onClick={checkFacilityIT}>
                        <div class="card-body p-4">
                            <div class="text-center mb-3">
                                <img src="images/reddit.svg" alt="" class="avatar-sm" />
                                <a href="#" class="text-body">
                                    <h5 class="mt-4 mb-2 font-size-15">Facility IT Inventory</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2" style={{ cursor: 'pointer' }}>
                    <div class="card" onClick={checkGarage}>
                        <div class="card-body p-4">
                            <div class="text-center mb-3">
                                <img src="images/sass.svg" alt="" class="avatar-sm" />
                                <a href="#" class="text-body">
                                    <h5 class="mt-4 mb-2 font-size-15">Fleet & Garage Managemnt</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2" style={{ cursor: 'pointer' }}>
                    <div class="card" onClick={checkLand}>
                        <div class="card-body p-4">
                            <div class="text-center mb-3">
                                <img src="images/adobe-photoshop.svg" alt="" class="avatar-sm" />
                                <a href="#" class="text-body">
                                    <h5 class="mt-4 mb-2 font-size-15">Land Module</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2" style={{ cursor: 'pointer' }}>
                <a href="https://helpdesk.health.go.ug/" target="_blank" rel="noopener noreferrer">
                    <div class="card">
                        <div class="card-body p-4">
                            <div class="text-center mb-3">
                                <img src="images/line.svg" alt="" class="avatar-sm" />
                                <a href="https://helpdesk.health.go.ug/" target="_blank" rel="noopener noreferrer" class="text-body">
                                    <h5 class="mt-4 mb-2 font-size-15">Help Desk</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                    </a>
                </div>
            </div>
        </div>

    )
}

export default Landing