import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FoodItem.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";


export default function FoodItem() {
    const params = useParams();
    const [item, setItem]  = useState(null);

    const contextData = useOutletContext();
    const [records, setRecords] = contextData.records;
    const [fetchErr, setFetchErr] = contextData.error;
    const [isLoading, setIsLoading] = contextData.loading;

    const [amount, setAmount] = useState(0);
    const [errMsg, setErrMsg] = useState(null);

    useEffect(() => {
        async function getItem() {
            try {
                const res = await fetch(`/api/food/${params.id}`);
                if (!res?.ok) {
                    throw new Error(`HTTP response code: ${res.status}`);
                }
                const data = await res.json();
                setItem(data);
            } catch (err) {
                console.error("Error fetching food item data:", err);
                setErrMsg(`Failed fetching food item data. ${err}`);
            }
        };
        getItem();
    }, [params.id]);

    let navigate = useNavigate();

    function isValid(amount) {
        const pattern = /^\d+(\.\d+)?$/;
        return typeof(amount) === "string" && pattern.test(amount) && (amount.length > 0);
    };

    async function logFood () {
        const userId = "1"; // hardcoded for now
        const cur_date = new Date().toJSON().slice(0,10);
        try {
            if (!isValid(amount)) {
                alert("Please, enter a number of grams");
                return
            };
            const newRecord = {
                userId: userId, 
                foodId: item.id, 
                amount: Number(amount),
                date: cur_date,
            };
            const res = await fetch(`/api/users/${userId}/food_records`, {
                method: "POST",
                body: JSON.stringify(newRecord)
            });
            if (!res?.ok) {
                throw new Error(`HTTP response code: ${res.status}`);
            };
            const data = await res.json();
            setRecords(old => [data, ...old]);
            navigate("/journal");            
        } catch (err) {
            console.error("Error logging the food item:", err);
            setErrMsg(`Failed to log the food item. ${err}`);
        };
    };

    if (errMsg) {
        return (
            <ErrorPage>{errMsg}</ErrorPage>
        )
    };

    if (fetchErr) {
        return (
            <ErrorPage>{fetchErr}</ErrorPage>
        )
    };

    if (isLoading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading the records...</h2>
            </div>
        )
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