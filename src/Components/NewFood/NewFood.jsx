import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";
import './NewFood.css';


export default function NewFood() {
    const [formData, setFormData] = useState({
        name: "",
        calories: "",
        proteins: "",
        carbs: "",
        fats: "",
        serving: ""
    });
    const [formErrors, setFormErrors] = useState([]);
    const navigate = useNavigate();
    const auth = useAuth();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    function isValid(num) {
        const pattern = /^\d+(\.\d+)?$/;
        return typeof(num) === "string" && pattern.test(num) && (num.length > 0);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors([]);
        if (!auth.user) {
            alert("You must be logged in to save a food item.");
        }
        if (formData.name.length < 3) {
            setFormErrors(prev => [...prev, "Food name must contain at least 3 characters."]);
        };
        for (const field in formData) {
            if (!isValid(formData[field]) && !(field === "name") && !(field === "serving")) {
                setFormErrors(prev => [...prev, `Please, enter a valid amount in grams into the field "${field}".`])
            };
        };
        if (formErrors.length > 0) {
            return;
        };
        try {
            const newItem = {
                name: formData.name,
                calories: Number(formData.calories),
                proteins: Number(formData.proteins),
                carbs: Number(formData.carbs),
                fats: Number(formData.fats),
                serving: formData.serving
            };
            const res = await fetch(`/api/food`, {
                method: "POST",
                body: JSON.stringify(newItem),
                headers: {
                    "Content-Type": "application/json",
                    "authentication": auth.user.token,
                }
            });
            if (!res?.ok) {
                throw new Error(`HTTP response code: ${res.status}`);
            };
            const data = await res.json();
            navigate(`/food/${data.id}`);            
        } catch (err) {
            console.error("Failed adding the item.", err);
            setFormErrors([`Failed creating the food item. ${err}`,]);
        };
    };

    if (auth.loading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading user's data...</h2>
            </div>
        )
    };

    return (
        <div className="white-container">
            <h1>Add a new food item</h1>
            {formErrors.map(err => <p className="red-text">{err}</p>)}
            <form onSubmit={handleSubmit} className="food-form">
                <label htmlFor="name">Name:
                    <input
                        id="name"
                        name="name"
                        onChange={handleChange}
                        type="text"
                        //placeholder="Name"
                        value={formData.name}
                        required
                />
                </label>
                <label htmlFor="calories">Calories:
                    <input
                        id="calories"
                        name="calories"
                        onChange={handleChange}
                        type="text"
                        placeholder="in 100g"
                        value={formData.calories}
                        required
                    />
                </label>
                <label htmlFor="proteins">Proteins:
                    <input
                        id="proteins"
                        name="proteins"
                        onChange={handleChange}
                        type="text"
                        placeholder="in 100g"
                        value={formData.proteins}
                        required
                    />
                </label>
                <label htmlFor="carbs">Carbohydrates:
                    <input
                        id="carbs"
                        name="carbs"
                        onChange={handleChange}
                        type="text"
                        placeholder="in 100g"
                        value={formData.carbs}
                        required
                    />
                </label>
                <label htmlFor="fats">Fats:
                    <input
                        id="fats"
                        name="fats"
                        onChange={handleChange}
                        type="text"
                        placeholder="in 100g"
                        value={formData.fats}
                        required
                    />
                </label>
                <label htmlFor="serving">Serving:
                    <input
                        id="serving"
                        name="serving"
                        onChange={handleChange}
                        type="text"
                        placeholder="typical serving size in grams (optional)"
                        value={formData.serving}
                    />
                </label>
                <button className="input-btn">Save</button>
            </form>
        </div>
    )
}