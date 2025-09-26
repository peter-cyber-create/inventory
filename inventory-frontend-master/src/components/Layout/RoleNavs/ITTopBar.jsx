/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom'

const ITTopBar = () => {
    return (
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/ict/dashboard" role="button">
                    <i class="bx bx-home-circle me-2"></i><span key="t-dashboards">Dashboard</span>
                </Link>
            </li>
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/ict/requisition" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">Stores Requisition</span>
                </Link>
            </li>
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/ict/issue" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">Issue ICT Asset</span>
                </Link>
            </li>
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/ict/inventory" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">Assets Inventory</span>
                </Link>
            </li>
            {/* <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-uielement" role="button"
                >
                    <i class="bx bx-tone me-2"></i>
                    <span key="t-ui-elements"> Manage Assets</span>
                    <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
                    <Link to="/ict/assets" class="dropdown-item" key="t-default">Asset Listing</Link>
                    <Link to="/ict/maintanance" class="dropdown-item" key="t-saas">Maintanance</Link>
                    <Link to="/ict/transfers" class="dropdown-item" key="t-crypto">Transfers</Link>
                </div>
            </li> */}
            {/* <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-pages" role="button"
                >
                    <i class="bx bx-customize me-2"></i><span key="t-apps">Data Center</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">

                    <Link to="/ict/servers" class="dropdown-item">Servers</Link>
                    <Link to="/ict/servers/virtual" class="dropdown-item">Virtual Servers</Link>
                    <Link to="/ict/servers/network" class="dropdown-item">Network Devices</Link>
                </div>
            </li> */}
            {/* <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/ict/dataimport" id="topnav-components" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">Data Import</span>
                </Link>
            </li> */}

            {/* <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to='/ict/reports' id="topnav-more" role="button"
                >
                    <i class="bx bx-file me-2"></i><span key="t-extra-pages">Reports</span> <div class="arrow-down"></div>
                </Link>
            </li> */}
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-pages" role="button"
                >
                    <i class="bx bx-customize me-2"></i><span key="t-apps">Reports</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
                    <Link to="/ict/reports/inventory" class="dropdown-item">ICT Inventory</Link>
                    <Link to="/ict/reports/users" class="dropdown-item">Assigned Users</Link>
                    <Link to="/ict/reports/transfers" class="dropdown-item">Asset Transfers</Link>
                    <Link to="/ict/reports/maintenance" class="dropdown-item">Preventive Maintenance</Link>
                    <Link to="/ict/reports/disposal" class="dropdown-item">Asset Disposal</Link>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-pages" role="button"
                >
                    <i class="bx bx-layout me-2"></i><span key="t-apps">Application Settings</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
                    <Link to='/ict/types' class="dropdown-item" key="t-compact-sidebar">Asset Types</Link>
                    <Link to='/ict/categories' class="dropdown-item" key="t-compact-sidebar">Asset Categories</Link>
                    <Link to='/ict/brands' class="dropdown-item" key="t-light-sidebar">Asset Brands</Link>
                    <Link to='/ict/models' class="dropdown-item" key="t-icon-sidebar">Asset Models</Link>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-pages" role="button"
                >
                    <i class="bx bx-customize me-2"></i><span key="t-apps">Master Settings</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-layout-verti">
                    <Link to="/ict/users" class="dropdown-item" key="t-light-sidebar">Users Management</Link>
                    <Link to="/ict/departments" class="dropdown-item" key="t-compact-sidebar">Departments</Link>
                    <Link to="/ict/divisions" class="dropdown-item" key="t-icon-sidebar">Division/Section/Unit</Link>
                    <Link to="/ict/staff" class="dropdown-item" key="t-icon-sidebar">Staff Users</Link>
                    <Link to="/ict/facilities" class="dropdown-item" key="t-icon-sidebar">Facilities</Link>
                </div>
            </li>
        </ul>
    )
}

export default ITTopBar