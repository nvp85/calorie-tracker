import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";


export default function Profile() {
    const auth = useAuth();

    if (auth.loading) {
        return (
            <div className="white-container">
                <h1 className="gray-text">User's profile is loading... </h1>
            </div>
        )
    }

    return (
        <div className="white-container">
            <h1>User's profile</h1>
            <p>Username: {auth.user.name} (edit)</p>
            <p>Calories budget: {auth.user.budget} (edit)</p>
            <a>Change password</a>
        </div>
    )
}