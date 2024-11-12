import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

export default function Login() {
    const [formData, setFormData] = useState({email: "user1@example.com", password: "123"});
    const auth = useAuth();

    const [err, setErr] = useState();

    async function handleLogin(e) {
        e.preventDefault();
        if (!new RegExp(/\S+@\S+\.\S+/).test(formData.email)) {
            setErr("Please enter a valid email address.");
            return;
        };
        if (!formData.email || !formData.password) {
            setErr("Please enter a valid email address and password.");
            return;
        };
        try {
            auth.login(formData.email, formData.password);
        } catch (err) {
            console.error("Fail to login.", err);
            setErr(`Fail to log in. ${err}`);
        }
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="white-container">
            <h1>Sign In</h1>
            {err ? <p className="red-text">{err}</p> : null}
            <form onSubmit={handleLogin} className="login-form">
                <input
                    name="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    required
                />
                <input
                    name="password"
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    required
                />
                <button>Log in</button>
            </form>
            <Link to={"/signup"}>Create an account</Link>
        </div>
    )
}