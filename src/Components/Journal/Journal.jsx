import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Journal.css";
import { LuPlus, LuMinus } from "react-icons/lu";
import { Link } from "react-router-dom";
import Popup from "../PopUp/PopUp";


export default function Journal() {
    const [records, setRecords] = useOutletContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [curRecord, setCurRecord] = useState(null);
    let total = {calories: 0, proteins: 0, fats: 0, carbs: 0};
    for (const record of records) {
        total.calories += record.calories_eaten;
        total.proteins += record.protein_eaten;
        total.fats += record.fat_eaten;
        total.carbs += record.carbs_eaten;
    };

    function deleteRecord(e, id) {
        const userId = 1;
        fetch(`/api/users/${userId}/food_records/${id}`, {method: "DELETE",})
        .then(res => {
            if (!res.ok) {
                alert("Error: fail to delete the record.");
            } else {
                setRecords(old => old.filter(item => item.id !== id));
                setIsPopupOpen(false);
                setCurRecord(null);
            }
        })
    };

    return (
        <div className="white-container">
            <h2>You have eaten today:</h2>
            <div className="summary"> 
                <p>Calories, total: {total.calories} kcal</p>
                <p>Proteins: {total.proteins} g | Fats: {total.fats} g | Carbs: {total.carbs} g</p>
            </div>
            {records.map(record => {
                return (
                    <div className="record" key={record.id}>
                        <div>
                            <p>{record.food_name}</p>
                            <p className="gray-text">Calories: {record.calories_eaten} | Amount: {record.amount} g.</p>
                        </div>
                        <div>
                            <button className="del-btn" onClick={() => {setCurRecord(record); setIsPopupOpen(true)}}><LuMinus className="circle-icon delete-icon"/></button>
                            <Link to={`/food/${record.food_id}`} className="food-select-btn"><LuPlus className="circle-icon"/></Link>
                        </div>
                    </div>
                )
            })}
            {isPopupOpen && <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                <p>Do you want to delete this record?</p>
                <p>{curRecord.food_name}, {curRecord.amount} g</p>
                <button onClick={(e) => deleteRecord(e, curRecord.id)}>Delete</button>
            </Popup>}
        </div>
    );
};