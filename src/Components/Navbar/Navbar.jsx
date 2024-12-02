import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css';
import { useAuth } from "../../hooks/AuthProvider";


export default function Navbar() {
    const activeStyle = {
        textDecoration: "underline",
        fontWeight: "bold",
    };

    const auth = useAuth();
    const username = auth.user ? auth.user.name : null;

    function handleLogout() {
        auth.logout();
    };
    return (
            <nav>
                <div className="nav-logo">
                    <img src="/logo.png" />
                    <Link to={"/"}>CalorieTracker</Link>
                </div>
                { (auth.user!=null) &&
                    <ul className="nav-links">
                        <li><NavLink to={"/journal"} style={({isActive}) => isActive ? activeStyle : null}>Journal</NavLink></li>
                        <li><NavLink to={"/search"} style={({isActive}) => isActive ? activeStyle : null}>Search food</NavLink></li>
                        <li><NavLink to={"/addfood"} style={({isActive}) => isActive ? activeStyle : null}>Add food</NavLink></li>
                    </ul>
                }
                { auth.user 
                    ?
                    <div>
                        <span><Link to="/profile" className="username">Welcome, {username}</Link></span>
                        <button className="login-btn orange btn" onClick={handleLogout}>Logout</button>
                    </div>
                    :
                    <div className="nav-buttons">
                        <Link to={"/login"} className="login-btn btn">Login</Link>
                        <Link to={"/signup"} className="signup-btn orange btn">Sign Up</Link>
                    </div>
                }
            </nav>
    )
}