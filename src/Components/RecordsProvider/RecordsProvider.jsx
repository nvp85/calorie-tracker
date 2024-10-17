import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";


export default function RecordsProvider() {
    const [records, setRecords] = useState([]);
    const id = "1"; // user's id hardcoded
    const date = new Date().toJSON().slice(0, 10);
    useEffect(() => {
        fetch(`api/users/${id}/food_records/${date}`)
        .then(res => res.json())
        .then(data => {
            setRecords(data);
        });
    }, []);

    return <Outlet context={[records, setRecords]} />
}