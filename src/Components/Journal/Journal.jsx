import React, { useEffect, useState } from "react";
import "./Journal.css";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";


export default function Journal() {
    const [records, setRecords] = useState([]);
    const id = "1"; // user's id hardcoded
    const date = new Date().toJSON().slice(0, 10); // add a date picker later
    useEffect(() => {
        fetch(`api/users/${id}/food_records/${date}`)
        .then(res => res.json())
        .then(data => {
            data = data.map(record => {
                return (
                    <div className="record" key={record.id}>
                        <div>
                        <p>{record.food_name}</p>
                        <p>Calories:{record.calories_eaten} | Amount: {record.amount} g.</p>
                        </div>
                        <Link to={`/food/${record.food_id}`} className="food-select-btn"><LuPlus className="add-icon"/></Link>
                    </div>
                )
            })
            setRecords(data);
        });
    }, [date]);
    return (
        <div className="food-records">
            <h2>You have eaten today:</h2>
            {records}
        </div>
    )
}