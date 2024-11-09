import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({email: "", password: ""});
    const [err, setErr] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("auth-token")) {
            navigate("/");
        }
    }, []);

    async function login(e) {
        e.preventDefault();
        if (!new RegExp(/\S+@\S+\.\S+/).test(formData.email)) {
            setErr("Please enter a valid email address.");
            return;
        }
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await res.json();
            if (!res?.ok) {
                if (data.errors)  {
                    throw new Error(data.errors.reduce((msg, err) => msg + "\n" + err));
                } else {
                    throw new Error(`HTTP response code: ${res.status}`);
                }
            };
            if (data.authtoken) {
                sessionStorage.setItem('auth-token', data.authtoken);
                navigate('/');
                window.location.reload();
            }
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
            <form onSubmit={login} className="login-form">
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
                />
                <button>Log in</button>
            </form>
            <Link to={"/signup"}>Create an account</Link>
        </div>
    )
}