import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import Popup from "../Popup/Popup";


export default function Profile() {
    const auth = useAuth();
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [newName, setNewName] = useState("");
    const [newBudget, setNewBudget] = useState(0);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    if (!auth.user || auth.loading) {
        console.log(auth.loading)
        return (
            <div className="white-container">
                <h1 className="gray-text">User's profile is loading... {auth.loading}</h1>
            </div>
        )
    }

    async function editProfile(body) {
        try {
            setIsProcessing(true);
            const res = await fetch("/api/users", {
                method: "PATCH",
                headers: {
                    "authentication": auth.user.token
                },
                body: JSON.stringify(body)
            }
            );
            if (res.ok) {
                if ("newPassword" in body) {
                    auth.logout();
                } else {
                    auth.setUser(prev => ({...prev, ...body}));
                }
                closeAllModals();
            }
            console.log(res);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    }

    function closeAllModals() {
        setIsNameModalOpen(false);
        setIsBudgetModalOpen(false);
        setIsPasswordModalOpen(false);
    };

    return (
        <div className="white-container">
            <h1>User's profile</h1>
            <p>Username: {auth.user.name} <button onClick={()=>setIsNameModalOpen(true)}>edit</button></p>
            <p>Calories budget: {auth.user.budget} <button onClick={()=>setIsBudgetModalOpen(true)}>edit</button></p>
            <p><button onClick={()=>setIsPasswordModalOpen(true)}>Change Password</button></p>
            {isNameModalOpen && 
                <Popup onClose={() => setIsNameModalOpen(false)}>
                    <h1>Edit the username</h1>
                    <input type="text" placeholder="Enter a new username" name="newName" className="input-box" onChange={(e) => setNewName(e.target.value)}/>
                    <button onClick={() => editProfile({name: newName})} className="input-btn" disabled={isProcessing}>Save</button>
                </Popup>
            }

            {isBudgetModalOpen && 
                <Popup onClose={() => setIsBudgetModalOpen(false)}>
                    <h1>Set a new calorie budget</h1>
                    <input type="text" placeholder="Enter a new budget, kcal" name="newBudget" className="input-box" onChange={(e) => setNewBudget(e.target.value)}/>
                    <button onClick={() => editProfile({budget: newBudget})} className="input-btn" disabled={isProcessing}>Save</button>
                </Popup>
            }

            {isPasswordModalOpen && 
                <Popup onClose={() => setIsPasswordModalOpen(false)}>
                    <h1>Set a new password</h1>
                    <input type="password" placeholder="Old password" name="oldPassword" className="" onChange={(e) => setOldPassword(e.target.value)}/>
                    <input type="password" placeholder="New password" name="newPassword" className="" onChange={(e) => setNewPassword(e.target.value)}/>
                    <button onClick={() => editProfile({newPassword: newPassword, oldPassword: oldPassword})} className="btn" disabled={isProcessing}>Save</button>
                </Popup>
            }
        </div>
    )
}