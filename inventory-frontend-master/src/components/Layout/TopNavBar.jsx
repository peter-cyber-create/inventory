import React from 'react'

import ITTopBar from './RoleNavs/ITTopBar'
import GarageBar from './RoleNavs/GarageBar'
import StoresBar from './RoleNavs/StoresBar'
import FinanceBar from './RoleNavs/FinanceBar'

const TopNavBar = () => {

    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <div class="topnav">
            <div class="container-fluid">
                <nav class="navbar navbar-light navbar-expand-lg topnav-menu">
                    <div class="collapse navbar-collapse  d-flex align-items-center justify-content-center" id="topnav-menu-content">
                        {user && user.role === 'it' && <ITTopBar />}
                        {user && user.role === 'garage' && <GarageBar />}
                        {user && user.role === 'store' && <StoresBar />}
                        {user && user.role === 'finance' && <FinanceBar />}
                    </div>
                </nav>
            </div>
        </div>


    )
}

export default TopNavBar