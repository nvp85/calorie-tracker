import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'


export default function Navbar({children}) {
    return (
        <div className="main-container">
            <nav>
                <div className="nav-logo">
                    <img src="/logo.png" />
                    <p>CalorieTracker</p>
                </div>
                <ul className="nav-links">
                    <li><Link to={"/journal"}>Journal</Link></li>
                    <li><Link to={"/search"}>Search food</Link></li>
                    <li><Link to={"/"}>Add food</Link></li>
                </ul>
                <div className="nav-buttons">
                    <Link to={"/"} className="login-btn btn">Login</Link>
                    <Link to={"/"} className="signup-btn orange btn">Sign Up</Link>
                </div>
            </nav>
            {children}
        </div>
    )
}