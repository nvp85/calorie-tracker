import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { LuEye, LuEyeOff } from "react-icons/lu";


export default function Login() {
    const [formData, setFormData] = useState({email: "user1@example.com", password: "123"});
    const [showPassword, setShowPassword] = useState(false);
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

    function togglePassword() {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="white-container">
            <h1>Sign In</h1>
            {auth.err ? <p className="red-text">{auth.err}</p> : null}
            {err ? <p className="red-text">{err}</p> : null}
            <form onSubmit={handleLogin} className="form position-relative">
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    required
                />
                <button type="button" className="eye-btn" onClick={togglePassword}>{showPassword ? <LuEyeOff/> : <LuEye/>}</button>
                <button type="submit" className="input-btn">Log in</button>
            </form>
            <p><Link to={"/signup"}>Create an account</Link></p>           
        </div>
    )
}