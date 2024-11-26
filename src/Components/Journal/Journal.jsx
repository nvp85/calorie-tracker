import React, { useState } from "react";
import { json, useOutletContext } from "react-router-dom";
import "./Journal.css";
import { LuPlus, LuMinus, LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import Popup from "../PopUp/PopUp";
import ErrorPage from "../ErrorPage/ErrorPage";
import { useAuth } from "../../hooks/AuthProvider";
import { isValidNum } from "../../utils";


export default function Journal() {
    const contextData = useOutletContext();
    const [records, setRecords] = contextData.records;
    const [fetchErr, setFetchErr] = contextData.error;
    const [isLoading, setIsLoading] = contextData.loading;
    const auth = useAuth();
    
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [curRecord, setCurRecord] = useState(null);
    const [newAmount, setNewAmount] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [isFetching,  setIsFetching] = useState(false);

    let total = {calories: 0, proteins: 0, fats: 0, carbs: 0};
    for (const record of records) {
        total.calories += record.calories_eaten;
        total.proteins += record.protein_eaten;
        total.fats += record.fat_eaten;
        total.carbs += record.carbs_eaten;
    };

    async function deleteRecord(e, id) {
        try {
            setIsFetching(true);
            const res = await fetch(`/api/food_records/${id}`, {
                method: "DELETE",
                headers: {
                    "authentication": auth.user.token
                },
            });
            if (!res?.ok) {
                throw new Error(`HTTP response code: ${res.status}`);
            };
            setRecords(old => old.filter(item => item.id !== id));
            popupCleanUp();
        } catch (err) {
            console.error("Failed to delete the record.", err);
            setErrMsg("Error: failed to delete the record. Please try again later.");
        } finally {
            setIsFetching(false);
        }
    };

    async function editRecord(e, id, amount) {

        if (!isValidNum(amount)) {
            setErrMsg("Please enter the weight in grams");
            return;
        }

        try {
            setIsFetching(true);
            amount = Math.round(amount);
            const res = await fetch(`/api/food_records/${id}`, {
                method: "PATCH",
                headers: {
                    "authentication": auth.user.token
                },
                body: JSON.stringify({amount: amount})
            });

            if (!res?.ok) {
                throw new Error(`HTTP Response Code: ${res?.status}`);
            };

            const json = await res.json();
            setRecords(old => [json, ...old.filter(item => item.id !== id)]);
            popupCleanUp();
        } catch (err) {
            setErrMsg(`Failed to update the record. ${err}`);
            console.error("Failed to update the record.", err);
        } finally {
            setIsFetching(false);
        }
    };

    function popupCleanUp() {
        setIsDeleteOpen(false);
        setIsEditOpen(false);
        setCurRecord(null);
        setNewAmount(null);
        setErrMsg(null);
    };

    if (auth.loading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading user's details...</h2>
            </div>
        )
    };

    if (isLoading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading the records...</h2>
            </div>
        )
    };

    if (fetchErr) {
        return (
            <ErrorPage>
                {fetchErr}
            </ErrorPage>
        )
    };

    return (
        <div className="white-container">
            <h2>You have eaten today:</h2>
            <div className="summary"> 
                <p>Calories, total: {total.calories} kcal</p>
                <p>Proteins: {total.proteins} g | Fats: {total.fats} g | Carbs: {total.carbs} g</p>
            </div>
            {records.length > 0 
                ? records.map(record => {
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
                                <button className="record-btn" onClick={() => {setCurRecord(record); setIsDeleteOpen(true)}}><LuTrash2 className="record-icon"/></button>
                                <Link to={`/food/${record.food_id}`} className="food-select-link"><LuPlus className="circle-icon"/></Link>
                            </div>
                        </div>
                    )
                })
                : <h3>No records found for today</h3>
            }
            {isDeleteOpen && 
                <Popup onClose={popupCleanUp}>
                    <h2>Do you want to delete this record?</h2>
                    <p>{curRecord.food_name}, {curRecord.amount} g</p>
                    {errMsg && <p className="red-text">{errMsg}</p>}
                    <button onClick={(e) => deleteRecord(e, curRecord.id)} disabled={isFetching}>Delete</button>
                </Popup>
            }
            {isEditOpen &&
                <Popup onClose={popupCleanUp}>
                    <h2>Edit the record</h2>
                    <p>{curRecord.food_name}, {curRecord.amount} g</p>
                    <p>Enter a new amount (weight in grams):</p>
                    <input name="newAmount" type="number" onChange={(e) => setNewAmount(e.target.value)}/>
                    {errMsg && <p className="red-text">{errMsg}</p>}
                    <button onClick={(e) => editRecord(e, curRecord.id, newAmount)} disabled={isFetching}>Save</button>
                </Popup>
            }
        </div>
    )
};