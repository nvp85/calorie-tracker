import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FoodItem.css";


export default function FoodItem() {
    const params = useParams();
    const [item, setItem]  = useState(null);

    useEffect(() => {
        fetch(`/api/food/${params.id}`)
            .then(res => res.json())
            .then(data => setItem(data))
    }, [params.id]);

    return (
        <div className="food-item-container">
            { item ? 
            <div>
            <h2>Log the food</h2>
            <p>{item.name}</p>
            <p>Calories, per 100g: {item.calories}, Serving size: {item.serving}</p>
            <p>Protein: {item.proteins} | Fat: {item.fats} | Carbohydrates: {item.carbs}</p>
            <label htmlFor="amount">Enter amount</label>
            <input type="text" id="amount"/>
            <button>Log</button>
            </div>
            : <p>Loading...</p>
            }
        </div>
    );
};