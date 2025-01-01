import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import Popup from "../Popup/Popup";
import { LuPencil} from "react-icons/lu";
import "./Profile.css";
import { isPasswordValid } from "../../utils";


export default function Profile() {
    const auth = useAuth();
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errMsg, setErrMsg] = useState([]);

    const [newName, setNewName] = useState("");
    const [newBudget, setNewBudget] = useState(0);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    if (!auth.user || auth.loading) { // why does just auth.loading not work for this?
        //console.log(auth.loading)
        return (
            <div className="white-container">
                <h1 className="gray-text">User's profile is loading...</h1>
            </div>
        )
    }

    async function editProfile(body) {
        
        if ("newPassword" in body && "oldPassword" in body) {
            if (body.newPassword == body.oldPassword) {
                setErrMsg(["A new password must be different from the old password."]);
                return;
            };
            let pass_check = isPasswordValid(body.newPassword); // returns object {ok: true/false, errors: []}
            if (!pass_check.ok) {
                setErrMsg(pass_check.errors);
                return;
            };
        };
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
            //console.log(res);
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
        setErrMsg([]);
    };

    return (
        <div className="white-container">
            <h1>User's profile</h1>
            <p>Username: {auth.user.name} <button onClick={()=>setIsNameModalOpen(true)} className="profile-icon"><LuPencil/></button></p>
            <p>Calories budget: {auth.user.budget} <button onClick={()=>setIsBudgetModalOpen(true)} className="profile-icon"><LuPencil/></button></p>
            <p><button onClick={()=>setIsPasswordModalOpen(true)} className="input-btn password-btn">Change Password</button></p>
            {isNameModalOpen && 
                <Popup onClose={() => setIsNameModalOpen(false)}>
                    <h1>Edit the username</h1>
                    {errMsg.length > 0 && errMsg.map((err) => (<p className="red-text">{err}</p>))}
                    <input type="text" placeholder="Enter a new username" name="newName" className="input-box" onChange={(e) => setNewName(e.target.value)}/>
                    <button onClick={() => editProfile({name: newName})} className="input-btn" disabled={isProcessing}>Save</button>
                </Popup>
            }

            {isBudgetModalOpen && 
                <Popup onClose={() => setIsBudgetModalOpen(false)}>
                    <h1>Set a new calorie budget</h1>
                    {errMsg.length > 0 && errMsg.map((err) => (<p className="red-text">{err}</p>))}
                    <input type="text" placeholder="Enter a new budget, kcal" name="newBudget" className="input-box" onChange={(e) => setNewBudget(e.target.value)}/>
                    <button onClick={() => editProfile({budget: newBudget})} className="input-btn" disabled={isProcessing}>Save</button>
                </Popup>
            }

            {isPasswordModalOpen && 
                <Popup onClose={closeAllModals}>
                    <h1>Set a new password</h1>
                    {errMsg.length > 0 && errMsg.map((err) => (<p className="red-text">{err}</p>))}
                    <div className="form">
                    <input type="password" placeholder="Old password" name="oldPassword" className="" onChange={(e) => setOldPassword(e.target.value)}/>
                    <input type="password" placeholder="New password" name="newPassword" className="" onChange={(e) => setNewPassword(e.target.value)}/>
                    <button onClick={() => editProfile({newPassword: newPassword, oldPassword: oldPassword})} className="input-btn" disabled={isProcessing}>Save</button>
                    </div>
                    <p style={{textAlign: "left"}}>
                        Password must:
                        <ul>
                            <li>be at least 8 characters long</li>
                            <li>include uppercase and lowercase letters</li>
                            <li>include at least one number and at least one special character</li>
                            <li>must not contain spaces</li>
                        </ul>
                    </p>
                </Popup>
            }
        </div>
    )
}