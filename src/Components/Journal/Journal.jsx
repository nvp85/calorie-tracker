import React, { useState } from "react";
import { json, useOutletContext } from "react-router-dom";
import "./Journal.css";
import { LuPlus, LuMinus, LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import Popup from "../PopUp/PopUp";


export default function Journal() {
    const [records, setRecords] = useOutletContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [curRecord, setCurRecord] = useState(null);
    const [newAmount, setNewAmount] = useState(null);
    const [editErrMsg, setEditErrMsg] = useState("");

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
                alert("Error: failed to delete the record.");
            } else {
                setRecords(old => old.filter(item => item.id !== id));
                setIsPopupOpen(false);
                setCurRecord(null);
            }
        })
    };

    function isValid(amount) {
        const pattern = /^\d+(\.\d+)?$/;
        return typeof(amount) === "string" && pattern.test(amount) && (amount.length > 0);
    };

    async function editRecord(e, id, amount) {
        const userId = 1;

        if (!isValid(amount)) {
            setEditErrMsg("Please enter a number of grams");
            return;
        }

        try {
            amount = Math.round(amount);
            const res = await fetch(`/api/users/${userId}/food_records/${id}`, {
                method: "PATCH",
                body: JSON.stringify({amount: amount})
            });
            
            if (!res?.ok) {
                throw new Error(`HTTP Response Code: ${res?.status}`);
            }
            const json = await res.json();
            popupCleanUp();
            setRecords(old => [json, ...old.filter(item => item.id !== id)]);
        } catch (err) {
            setEditErrMsg(`Failed to update the record. Error: ${err}`);
        }
    };

    function popupCleanUp() {
        setIsPopupOpen(false);
        setIsEditOpen(false);
        setCurRecord(null);
        setNewAmount(null);
        setEditErrMsg("");
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
                            <p className="gray-text">
                                Calories: {record.calories_eaten} | Amount: {record.amount} g. 
                            </p>
                        </div>
                        <div>
                            <button className="record-btn" onClick={() => {setCurRecord(record); setIsEditOpen(true)}}><LuPencil className="record-icon"/></button>
                            <button className="record-btn" onClick={() => {setCurRecord(record); setIsPopupOpen(true)}}><LuTrash2 className="record-icon"/></button>
                            <Link to={`/food/${record.food_id}`} className="food-select-link"><LuPlus className="circle-icon"/></Link>
                        </div>
                    </div>
                )
            })}
            {isPopupOpen && 
                <Popup onClose={popupCleanUp}>
                    <p>Do you want to delete this record?</p>
                    <p>{curRecord.food_name}, {curRecord.amount} g</p>
                    <button onClick={(e) => deleteRecord(e, curRecord.id)}>Delete</button>
                </Popup>
            }
            {isEditOpen &&
                <Popup onClose={popupCleanUp}>
                    <p>Edit the record</p>
                    <p>{curRecord.food_name}, {curRecord.amount} g</p>
                    <p>Enter new amount (weight in grams):</p>
                    <input name="newAmount" type="number" onChange={(e) => setNewAmount(e.target.value)}/>
                    <button onClick={(e) => editRecord(e, curRecord.id, newAmount)}>Save</button>
                    <p>{editErrMsg}</p>
                </Popup>
            }
        </div>
    )
};