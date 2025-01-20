import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // user object {id, name, email, budget, token}
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(""); 

    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchUser() {
            const storetoken = sessionStorage.getItem('auth-token');
            if (!storetoken) {
                return;
            }
            setLoading(true);
            try {
                const res = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'authentication': storetoken,
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                if (res?.ok) {
                    setUser({...data, token: storetoken});
                } else {
                    if (data.errors) {
                        throw new Error(`Failed to fetch user data. ${data.errors.reduce((errors, err) => errors + " " + err)}`);
                    } else {
                        throw new Error(`Failed to fetch user data. HTTP response code: ${res.status}`);
                    }
                }
            } catch (err) {
                console.error(err);
                setErr(`${err} Sorry, you have been logged out.`);
                logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    async function login(email, password) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        const data = await res.json();
        if (!res?.ok) {
            if (data.errors)  {
                throw new Error(data.errors.reduce((msg, err) => msg + " " + err));
            } else {
                throw new Error(`HTTP response code: ${res.status}`);
            }
        };
        if (data.authtoken) {
            sessionStorage.setItem('auth-token', data.authtoken);
            setUser({...data.user, token: data.authtoken});
            navigate('/journal');
        }
    };

    function logout() {
        setUser(null);
        sessionStorage.removeItem('auth-token');
        navigate('/login');
    };

    async function register(newUser) {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            if (!res?.ok) {
                if (data.errors)  {
                    throw new Error(data.errors.reduce((msg, err) => msg + " " + err));
                } else {
                    throw new Error(`HTTP response code: ${res.status}`);
                }
            }
            if (data.authtoken) {
                sessionStorage.setItem('auth-token', data.authtoken);
                setUser({...data.user, token: data.authtoken});
                //navigate('/profile');
                return {success: true, }
            }
        } catch (err) {
            console.error(err);
            return {success: false, error: err.message};
        };
    };

    return (
        <AuthContext.Provider value={{loading, user, setUser, login, logout, register, err}}>
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
    return useContext(AuthContext);
};