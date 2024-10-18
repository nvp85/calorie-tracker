import React from "react";
import { useOutletContext } from "react-router-dom";
import "./Journal.css";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";


export default function Journal() {
    const [records, setRecords] = useOutletContext();
    let total = {calories: 0, proteins: 0, fats: 0, carbs: 0};
    for (const record of records) {
        total.calories += record.calories_eaten;
        total.proteins += record.protein_eaten;
        total.fats += record.fat_eaten;
        total.carbs += record.carbs_eaten;
    };
    return (
        <div className="white-container">
            <h2>You have eaten today:</h2>
            <div className="summary"> 
                <p>Calories, total: {total.calories} Ccal</p>
                <p>Proteins: {total.proteins} g | Fats: {total.fats} g | Carbs: {total.carbs} g</p>
            </div>
            {records.map(record => {
                return (
                    <div className="record" key={record.id}>
                        <div>
                        <p>{record.food_name}</p>
                        <p>Calories: {record.calories_eaten} | Amount: {record.amount} g.</p>
                        </div>
                        <Link to={`/food/${record.food_id}`} className="food-select-btn"><LuPlus className="add-icon"/></Link>
                    </div>
                )
            })}
        </div>
    );
};