/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";

const GarageBar = () => {
  return (
    <ul class="navbar-nav  w-100 d-flex align-items-center justify-content-between ">
      <li class="nav-item dropdown">
        <Link
          class="nav-link dropdown-toggle arrow-none"
          to="/fleet/dashboard"
          role="button"
        >
          <i class="bx bx-home-circle me-2"></i>
          <span key="t-dashboards">Dashboard</span>
        </Link>
      </li>
      <li class="nav-item dropdown">
        <Link
          class="nav-link dropdown-toggle arrow-none"
          to="/fleet/vehicles"
          role="button"
        >
          <i class="bx bx-tone me-2"></i>
          <span key="t-dashboards">Fleet Management</span>
        </Link>
      </li>

      <li class="nav-item dropdown">
        <Link
          class="nav-link dropdown-toggle arrow-none"
          to="/fleet/jobcards"
          id="topnav-components"
          role="button"
        >
          <i class="bx bx-file me-2"></i>
          <span key="t-components">Job Cards</span>
        </Link>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle arrow-none"
          href="#"
          id="topnav-pages"
          role="button"
        >
          <i class="bx bx-customize me-2"></i>
          <span key="t-apps">Garage Service</span>{" "}
          <div class="arrow-down"></div>
        </a>
        <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
          <Link to="/fleet/requistion" class="dropdown-item" key="t-default">
            Service Request
          </Link>
          <Link to="/fleet/receiving" class="dropdown-item" key="t-saas">
            Garage Receiving
          </Link>
          {/* <Link to="/fleet/jobcard" class="dropdown-item" key="t-crypto">Garage Job Form</Link> */}
        </div>
      </li>
      {/* <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle arrow-none" href="#" id="topnav-more" role="button"
                >
                    <i class="bx bx-file me-2"></i><span key="t-extra-pages">Vehicle Repairs</span> <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
   
                    <Link to="/fleet/jobcards" class="dropdown-item" key="t-saas">Vehicle Repairs</Link>
                </div>
            </li> */}

      <li class="nav-item dropdown">
        <Link
          class="nav-link dropdown-toggle arrow-none"
          to="/fleet/spareparts"
          id="topnav-components"
          role="button"
        >
          <i class="bx bx-collection me-2"></i>
          <span key="t-components">Spare Parts</span>
        </Link>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle arrow-none"
          href="#"
          id="topnav-pages"
          role="button"
        >
          <i class="bx bx-customize me-2"></i>
          <span key="t-apps">Reports</span> <div class="arrow-down"></div>
        </a>
        <div class="dropdown-menu" aria-labelledby="topnav-dashboard">
          <Link
            to="/fleet/reports/jobcards"
            class="dropdown-item"
            key="t-crypto"
          >
            Job Cards
          </Link>
          <Link
            to="/fleet/reports/services"
            class="dropdown-item"
            key="t-crypto"
          >
            Services
          </Link>
          {/* <Link to="/fleet/reports/servicehistory" class="dropdown-item" key="t-default">Vehicle Service History</Link>
                    <Link to="/fleet/reports/inventory" class="dropdown-item" key="t-saas">Fleet Inventory</Link>
                    <Link to="/fleet/reports.parts" class="dropdown-item" key="t-crypto">Vehicle Parts</Link> */}
        </div>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle arrow-none"
          href="#"
          id="topnav-layout"
          role="button"
        >
          <i class="bx bx-layout me-2"></i>
          <span key="t-layouts">Application Settings</span>{" "}
          <div class="arrow-down"></div>
        </a>
        <div class="dropdown-menu" aria-labelledby="topnav-layout">
          <div class="dropdown">
            <a
              class="dropdown-item dropdown-toggle arrow-none"
              href="#"
              id="topnav-layout-verti"
              role="button"
            >
              <span key="t-vertical">Vehicle Settings</span>{" "}
              <div class="arrow-down"></div>
            </a>
            <div class="dropdown-menu" aria-labelledby="topnav-layout-verti">
              <Link
                to="/fleet/vehicles/types"
                class="dropdown-item"
                key="t-light-sidebar"
              >
                Vehicle Types
              </Link>
              <Link
                to="/fleet/vehicles/make"
                class="dropdown-item"
                key="t-compact-sidebar"
              >
                Vehicle Make
              </Link>
            </div>
          </div>
          <div class="dropdown">
            <a
              class="dropdown-item dropdown-toggle arrow-none"
              href="#"
              id="topnav-layout-hori"
              role="button"
            >
              <span key="t-horizontal">Garage Management</span>{" "}
              <div class="arrow-down"></div>
            </a>
            <div class="dropdown-menu" aria-labelledby="topnav-layout-verti">
              <Link
                to="/fleet/masters/categories"
                class="dropdown-item"
                key="t-light-sidebar"
              >
                Spare Part Category
              </Link>
              <Link
                to="/fleet/masters/garages"
                class="dropdown-item"
                key="t-light-sidebar"
              >
                Garages
              </Link>
            </div>
          </div>
          <div class="dropdown">
            <a
              class="dropdown-item dropdown-toggle arrow-none"
              href="#"
              id="topnav-layout-hori"
              role="button"
            >
              <span key="t-horizontal">Masters Management</span>{" "}
              <div class="arrow-down"></div>
            </a>
            <div class="dropdown-menu" aria-labelledby="topnav-layout-verti">
              <Link
                to="/fleet/masters/drivers"
                class="dropdown-item"
                key="t-light-sidebar"
              >
                Drivers
              </Link>
              <Link
                to="/fleet/masters/departments"
                class="dropdown-item"
                key="t-compact-sidebar"
              >
                Departments
              </Link>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default GarageBar;
