import React from "react";
import { useOutletContext } from "react-router-dom";
import "./Journal.css";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";


export default function Journal() {
    const [records, setRecords] = useOutletContext();
    return (
        <div className="white-container">
            <h2>You have eaten today:</h2>
            {records.map(record => {
                return (
                    <div className="record" key={record.id}>
                        <div>
                        <p>{record.food_name}</p>
                        <p>Calories:{record.calories_eaten} | Amount: {record.amount} g.</p>
                        </div>
                        <Link to={`/food/${record.food_id}`} className="food-select-btn"><LuPlus className="add-icon"/></Link>
                    </div>
                )
            })}
        </div>
    );
};