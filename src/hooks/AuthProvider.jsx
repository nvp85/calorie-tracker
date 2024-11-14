import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // user object {id, name, email, budget, token}
    let isLoggedIn = user ? true : false;

    const navigate = useNavigate();
    
    useEffect(() => {
        console.log('mounted');
        async function fetchUser() {
            const storetoken = sessionStorage.getItem('auth-token'); 
            if (storetoken) {
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
                        console.log(data);
                        setUser({...data, token: storetoken});
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Failed to fetch user data');
                    logout();
                }

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
                throw new Error(data.errors.reduce((msg, err) => msg + "\n" + err));
            } else {
                throw new Error(`HTTP response code: ${res.status}`);
            }
        };
        if (data.authtoken) {
            sessionStorage.setItem('auth-token', data.authtoken);
            setUser(data.user);
            navigate('/journal');
        }
    };

    function logout() {
        setUser(null);
        sessionStorage.removeItem('auth-token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth() {
    return useContext(AuthContext);
};