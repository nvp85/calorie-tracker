import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";


export default function RecordsProvider() {
    const [records, setRecords] = useState([]);
    const id = "1"; // user's id hardcoded
    const date = new Date().toJSON().slice(0, 10);
    const [errMsg, setErrMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const res = await fetch(`api/users/${id}/food_records/${date}`);
                if (!res?.ok) {
                    throw new Error(`HTTP response code: ${res.status}`);
                }
                const data = await res.json();
                setRecords(data);
            } catch(err) {
                console.error("Failed to fetch records.", err);
                setErrMsg(`Failed to fetch records. ${err}`);
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, []);
    return <Outlet context={{records: [records, setRecords], error: [errMsg, setErrMsg], loading: [isLoading, setIsLoading]}} />;
}