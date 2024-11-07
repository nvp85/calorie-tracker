import React from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css';


export default function Navbar() {
    const activeStyle = {
        textDecoration: "underline",
        fontWeight: "bold",
    };
    return (
            <nav>
                <div className="nav-logo">
                    <img src="/logo.png" />
                    <p>CalorieTracker</p>
                </div>
                <ul className="nav-links">
                    <li><NavLink to={"/journal"} style={({isActive}) => isActive ? activeStyle : null}>Journal</NavLink></li>
                    <li><NavLink to={"/search"} style={({isActive}) => isActive ? activeStyle : null}>Search food</NavLink></li>
                    <li><NavLink to={"/"} style={({isActive}) => isActive ? activeStyle : null}>Add food</NavLink></li>
                </ul>
                <div className="nav-buttons">
                    <Link to={"/login"} className="login-btn btn">Login</Link>
                    <Link to={"/signup"} className="signup-btn orange btn">Sign Up</Link>
                </div>
            </nav>
    )
}