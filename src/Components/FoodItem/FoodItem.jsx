import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FoodItem.css";
import { useOutletContext, useNavigate } from "react-router-dom";


export default function FoodItem() {
    const params = useParams();
    const [item, setItem]  = useState(null);
    const [records, setRecords] = useOutletContext();
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        fetch(`/api/food/${params.id}`)
            .then(res => res.json())
            .then(data => setItem(data))
    }, [params.id]);

    let navigate = useNavigate();

    function isValid(amount) {
        const pattern = /^\d+(\.\d+)?$/;
        return typeof(amount) === "string" && pattern.test(amount) && (amount.length > 0);
    };

    function logFood () {
        const userId = "1"; // hardcoded for now
        const cur_date = new Date().toJSON().slice(0,10);
        if (isValid(amount)) {
            const newRecord = {
                userId: userId, 
                foodId: item.id, 
                amount: Number(amount),
                date: cur_date,
            };
            fetch(`/api/users/${userId}/food_records`, {
                method: "POST",
                body: JSON.stringify(newRecord)
            })
            .then(res => res.json())
            .then(data => {
                setRecords(old => [data, ...old]);
                navigate("/journal");
            })
        } else {
            alert("Please, enter a number of grams");
        }
    };

    return (
        <div className="white-container">
            { item ? 
            <div>
            <h2>Log the food</h2>
            <p>{item.name}</p>
            <p>Calories, per 100g: {item.calories}, Serving size: {item.serving}</p>
            <p>Proteins: {item.proteins} g | Fats: {item.fats} g | Carbs: {item.carbs} g</p>
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" name="amount" onChange={(e) => setAmount(e.target.value)} className="input-box" placeholder="Enter weight in grams"/>
            <button className="input-btn" onClick={logFood}>Save</button>
            </div>
            : <p>Loading...</p>
            }
        </div>
    );
};