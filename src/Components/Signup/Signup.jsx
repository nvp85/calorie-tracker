import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { LuEye, LuEyeOff } from "react-icons/lu";


export default function Signup() {
    const [formData, setFormData] = useState({email: "", username: "", password: ""});
    const [formErr, setFormErr] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const auth = useAuth();

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErr([]);
        const errors = [];
        if (!new RegExp(/\S+@\S+\.\S+/).test(formData.email)) {
            errors.push( "Please enter a valid email address.");
        };
        if (!formData.email || !formData.password) {
            errors.push("Please enter a valid email address and password.");
        };
        if (formData.password.length < 8) {
            errors.push("Password should be at least 8 characters long.");
        };
        if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'<>?,./]).*$/.test(formData.password)) {
            errors.push("Password should include at least one uppercase and one lowercase letter, at least one number, and at least one special character.");
        };
        if (/^(?=.*\s).*$/.test(formData.password)) {
            errors.push("Password should not contain whitespaces.");
        };
        if (errors.length > 0) {
            setFormErr(errors);
            return;
        };
        const newUser = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };
        try {
            setProcessing(true);
            const status = await auth.register(newUser);
            if (!status.success) {
                setFormErr(["Sorry, an error has accured.", status.error]);
            } else {
                navigate("/profile");
            };
        } catch (err) {
            console.error(err);
            setFormErr(["Sorry, an error has accured. Failed to create an account."]);
        } finally {
            setProcessing(false);
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
            <h1>Create an account</h1>
            { processing && <p className="gray-text">Creating an account...</p> }
            {
                formErr.map(err => <p className="red-text" key={err}>{err}</p>)
            }
            <form onSubmit={handleSubmit} className="form position-relative">
                <input
                    name="username"
                    onChange={handleChange}
                    type="username"
                    placeholder="Username"
                    value={formData.username}
                    required
                    pattern="[A-Za-z0-9]+"
                />
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
                <button type="submit" className="input-btn" disabled={processing}>Sign Up</button>
            </form>
            <p>Already have an account? <Link to={"/login"}>Sign in.</Link></p>
        </div>
    )
}