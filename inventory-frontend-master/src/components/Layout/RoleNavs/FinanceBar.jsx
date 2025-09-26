/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';

const FinanceBar = () => {

    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <ul className="navbar-nav">
            <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle arrow-none" to="#" role="button">
                    <i className="bx bx-home-circle me-2"></i>
                    <span key="t-dashboards">Dashboard</span>
                </Link>
            </li>

            <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle arrow-none" to="/activities/add" id="topnav-components" role="button">
                    <i className="bx bx-plus-circle me-2"></i>
                    <span key="t-components">Add New Activity</span>
                </Link>
            </li>

            <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle arrow-none" to="/activities/listing" id="topnav-components" role="button">
                    <i className="bx bx-list-ul me-2"></i>
                    <span key="t-components">View All Activities</span>
                </Link>
            </li>

            {/* New Reports Dropdown */}
            <li className="nav-item dropdown">
                <a
                    className="nav-link dropdown-toggle arrow-none"
                    href="#"
                    id="topnav-reports"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="bx bx-file me-2"></i>
                    <span key="t-reports">Reports</span>
                    <div className="arrow-down"></div>
                </a>
                <div className="dropdown-menu" aria-labelledby="topnav-reports">
                    <Link to="/report/flagged" className="dropdown-item">
                        <i className="bx bx-flag me-2"></i>Flagged Users
                    </Link>
                    <Link to="/report/participant/activity" className="dropdown-item">
                        <i className="bx bx-calendar me-2"></i>Activity per Participant
                    </Link>
                    <Link to="/report/user/amounts" className="dropdown-item">
                        <i className="bx bx-calendar me-2"></i>Participant Total Amounts
                    </Link>
                    {/* <Link to="/report/accountability" className="dropdown-item">
                        <i className="bx bx-time me-2"></i>Pending Accountability
                    </Link> */}
                    <Link to="/report/person" className="dropdown-item">
                        <i className="bx bx-user me-2"></i>Activities per Person
                    </Link>
                    {/* <Link to="/report/activities" className="dropdown-item">
                        <i className="bx bx-calendar-event me-2"></i>Activities by Date Range
                    </Link> */}
                    <Link to="/report/funding" className="dropdown-item">
                        <i className="bx bx-money me-2"></i>Activities by Funding Source
                    </Link>
                </div>
            </li>

            {user && user.module === 'Admin' && <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle arrow-none" to="/activities/users" id="topnav-components" role="button">
                    <i className="bx bx-cog me-2"></i>
                    <span key="t-components">Users List</span>
                </Link>
            </li>
            }

            
        </ul>
    );
};

export default FinanceBar;