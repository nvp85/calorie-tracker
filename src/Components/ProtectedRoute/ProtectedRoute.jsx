import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";


export default function ProtectedRoute() {
    const auth = useAuth();
    //console.log(auth.loading, auth.user);
    
    if (auth.loading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading user's details...</h2>
            </div>
        )
    };

    if (!auth.user) {
        return <Navigate to="/login" />
    };

    return <Outlet />;
};