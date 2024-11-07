import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({email: "", password: ""});

    function handleSubmit(e) {
        e.preventDefault();
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="white-container">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    name="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                />
                <input
                    name="password"
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                />
                <button>Log in</button>
            </form>
            <Link to={"/signup"}>Create an account</Link>
        </div>
    )
}