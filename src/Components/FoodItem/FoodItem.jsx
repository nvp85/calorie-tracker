import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FoodItem.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useAuth } from "../../hooks/AuthProvider";
import { isValidNum } from "../../utils";


export default function FoodItem() {
    const params = useParams();
    const [item, setItem]  = useState(null);

    const contextData = useOutletContext();
    const [records, setRecords] = contextData.records;
    const [fetchErr, setFetchErr] = contextData.error;
    const [isLoading, setIsLoading] = contextData.loading;

    const auth = useAuth();

    const [amount, setAmount] = useState(0);
    const [errMsg, setErrMsg] = useState(null);

    useEffect(() => {
        async function getItem() {
            try {
                const res = await fetch(`/api/food/${params.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authentication": auth.user.token,
                    }
                });
                const data = await res.json();
                if (!res?.ok) {
                    if (data.errors) {
                        throw new Error(data.errors.reduce((msg, err) => msg + " " + err));
                    }
                    throw new Error(`HTTP response code: ${res.status}`);
                }
                setItem(data);
            } catch (err) {
                console.error("Error fetching food item data:", err);
                setErrMsg(`Failed fetching food item data. ${err}`);
            }
        };
        if (auth.user) {
            getItem();
        }
    }, [params.id, auth.user]);

    let navigate = useNavigate();

    async function logFood () {
        const cur_date = new Date().toJSON().slice(0,10);
        try {
            if (!isValidNum(amount)) {
                alert("Please, enter a number of grams");
                return
            };
            const newRecord = { 
                foodId: item.id, 
                amount: Number(amount),
                date: cur_date,
            };
            const res = await fetch(`/api/food_records`, {
                method: "POST",
                body: JSON.stringify(newRecord),
                headers: {
                    "Content-Type": "application/json",
                    "authentication": auth.user.token,
                }
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

    if (auth.loading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading the user's data...</h2>
            </div>
        )
    }

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