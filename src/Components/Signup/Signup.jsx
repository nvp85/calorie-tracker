import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [formData, setFormData] = useState({email: "", password1: "", password2: ""});

    function handleSubmit(e) {
        e.preventDefault();
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="white-container">
            <h1>Create an account</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    name="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                />
                <input
                    name="password1"
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    value={formData.password1}
                />
                <input
                    name="password2"
                    onChange={handleChange}
                    type="password"
                    placeholder="Repeat password"
                    value={formData.password2}
                />
                <button>Sign Up</button>
            </form>
            <p>Already have an account? <Link to={"/login"}>Sign in.</Link></p>
        </div>
    )
}