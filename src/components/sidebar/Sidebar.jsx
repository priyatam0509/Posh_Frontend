import React from 'react';
import ReactDOM from 'react-dom';
import "./sidebar.scss";
import image from "./posh-white.png";
import { Form, Link,useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PaidIcon from '@mui/icons-material/Paid';
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const logoutBtnCall = () => {
    sessionStorage.clear();
    navigate('/login');
  }
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo"><img className="margin-top10" src={image} height={90} width={200} /></span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }} >
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          </Link>
          <Link to="/users"  style={{ textDecoration: "none" }}>
          <li>
              <PersonOutlineIcon className="icon" />
              <span>Registration</span>
            </li>
            </Link>
          {/* <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>

          </Link> */}
          {/* <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </Link> */}
          {/* <li>
            <CreditCardIcon className="icon" />
            <span>Orders</span>
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li> */}
          {/* <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li> */}

          <p className="title">SERVICE</p>
          <Link to="/notification" style={{ textDecoration: "none" }}>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          </Link>
          <Link to="/expenses" style={{ textDecoration: "none" }}>
          <li>
            <PaidIcon className="icon" />
            <span>Expenses</span>
          </li>
          </Link>
          {/* <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <dspan>Settings</span>
          </li> */}
          <p className="title ">USER</p>
          <Link to="/Inactive" style={{ textDecoration: "none" }}>
          <li>
            <PaidIcon className="icon" />
            <span>Inactive User</span>
          </li>
          </Link>
          <Link to="/Active" style={{ textDecoration: "none" }}>
          <li>
            <PaidIcon className="icon" />
            <span>Active User</span>
          </li>
          </Link>
          <li  onClick = {logoutBtnCall}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
