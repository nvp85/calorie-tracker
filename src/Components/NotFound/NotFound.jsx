import React from "react"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="white-container">
            <h1>404</h1>
            <h2>Sorry, the page you were looking for was not found.</h2>
            <Link to="/">Return to Home</Link>
        </div>
    )
}