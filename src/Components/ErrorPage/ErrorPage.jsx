import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage({children}) {
    return (
        <div className="white-container">
            <h1>Sorry, an error has occured</h1>
            <p className="red-text">{children}</p>
            <Link to="/">Return to Home</Link>
        </div>
    )
}