import React from "react";
import './LandingPage.css';
import { Link } from "react-router-dom";


export default function LandingPage() {
    return (
        <div className="hero-container">
            <h1>Track Your Calories, Reach Your Goals</h1>
            <p>Say goodbye to guesswork and hello to a healthier you! </p>
            <p>Our minimalistic calorie tracker makes it easy to log meals, track nutrients, and stay on top of your goals. 
                With a simple, user-friendly interface, you’ll have all the tools you need to eat better and feel great. 
                Start tracking today for a happier, healthier tomorrow!</p>
            <Link to="/signup" className="start-btn orange btn">Get started</Link>
        </div>
    )
}