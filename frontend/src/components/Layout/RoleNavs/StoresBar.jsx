import React from 'react'
import { Link } from 'react-router-dom'

const StoresBar = () => {
    return (
        <ul class="navbar-nav">
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/dashboard" role="button">
                    <i class="bx bx-home-circle me-2"></i><span key="t-dashboards">Dashboard</span>
                </Link>
            </li>
            {/* <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/goods/received" id="topnav-components" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">Receive Goods</span>
                </Link>
            </li> */}
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/assets/register" id="topnav-components" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">ICT Assets Register</span>
                </Link>
            </li>
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/ict/requisition" id="topnav-components" role="button"
                >
                    <i class="bx bx-tone  me-2"></i><span key="t-components">ICT Requisitions</span>
                </Link>
            </li>
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/requisition-form" id="topnav-components" role="button">
                    <i class="bx bx-file me-2"></i><span key="t-components">Stores Requisition Form</span>
                </Link>
            </li>
            {/* <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-uielement" role="button"
                >
                    <i class="bx bx-tone me-2"></i>
                    <span key="t-ui-elements"> Stores Inventory</span>
                    <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
                    <Link to="/stores/products" class="dropdown-item" key="t-default">Product Listing</Link>
                    <Link to="/stores/ledger" class="dropdown-item" key="t-default">Stores Ledger</Link>
                </div>
            </li> */}
            {/* <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-pages" role="button"
                >
                    <i class="bx bx-customize me-2"></i><span key="t-apps">Stores Requisition</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">

                    <Link to="/stores/ict/requisition" class="dropdown-item">ICT Requisitions</Link>
                    <Link to="/stores/parts/requisition" class="dropdown-item">Vehicle Parts Requisitions</Link>
                </div>
            </li> */}
            {/* <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/requisition" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">Stores Requisition</span>
                </Link>
            </li> */}
            <li class="nav-item dropdown">
                <Link class="nav-link dropdown-toggle arrow-none" to="/stores/dispatched" id="topnav-components" role="button"
                >
                    <i class="bx bx-collection me-2"></i><span key="t-components">ICT Dispatched Items</span>
                </Link>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-more" role="button"
                >
                    <i class="bx bx-file me-2"></i><span key="t-extra-pages">Reports</span> <div class="arrow-down"></div>
                </a>
                {/* <div class="dropdown-menu" aria-labelledby="topnav-dashboard">

                                    <a href="index.html" class="dropdown-item" key="t-default">Default</a>
                                    <a href="dashboard-saas.html" class="dropdown-item" key="t-saas">Saas</a>
                                    <a href="dashboard-crypto.html" class="dropdown-item" key="t-crypto">Crypto</a>
                                    <a href="dashboard-blog.html" class="dropdown-item" key="t-blog">Blog</a>
                                    <a href="dashboard-job.html" class="dropdown-item" key="t-Jobs">Jobs</a>
                                </div> */}
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-layout" role="button"
                >
                    <i class="bx bx-layout me-2"></i><span key="t-layouts">Application Settings</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-layout">
                    <div class="dropdown">
                        <a class="dropdown-item dropdown-toggle arrow-none" href="#" id="topnav-layout-verti"
                            role="button">
                            <span key="t-vertical">User Management</span> <div class="arrow-down"></div>
                        </a>
                        <div class="dropdown-menu" aria-labelledby="topnav-layout-verti">
                            <a href="#" class="dropdown-item" key="t-light-sidebar">Users List</a>
                            <a href="#" class="dropdown-item" key="t-compact-sidebar">Roles List</a>
                            <a href="#" class="dropdown-item" key="t-icon-sidebar">Permissions List</a>
                        </div>
                    </div>
                    {/* <div class="dropdown">
                        <a class="dropdown-item dropdown-toggle arrow-none" href="#" id="topnav-layout-hori"
                            role="button">
                            <span key="t-horizontal">Assets Management</span> <div class="arrow-down"></div>
                        </a>
                        <div class="dropdown-menu" aria-labelledby="topnav-layout-verti">
                            <a href="layouts-light-sidebar.html" class="dropdown-item" key="t-light-sidebar">Asset Types</a>
                            <a href="layouts-compact-sidebar.html" class="dropdown-item" key="t-compact-sidebar">Asset Categories</a>
                            <a href="layouts-icon-sidebar.html" class="dropdown-item" key="t-icon-sidebar">Asset Models</a>
                        </div>
                    </div> */}
                </div>
            </li>
        </ul>
    )
}

export default StoresBar