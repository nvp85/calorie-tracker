import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";


export default function RecordsProvider() {
    const [records, setRecords] = useState([]);
    const auth = useAuth();
    const date = new Date().toJSON().slice(0, 10);
    const [errMsg, setErrMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/food_records/${date}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authentication": auth.user.token,
                    }
                });
                const data = await res.json();
                if (!res?.ok) {
                    if (data.errors) {
                        throw new Error(data.errors.reduce((msg, err) => msg + "\n" + err));
                    } else {
                        throw new Error(`HTTP response code: ${res.status}`);
                    }
                }
                setRecords(data);
            } catch(err) {
                console.error("Failed to fetch records.", err);
                setErrMsg(`Failed to fetch records. ${err}`);
            } finally {
                setIsLoading(false);
            }
        };
        if (auth.user) {
            getData();
        }
    }, [auth.user]);

    return <Outlet context={{records: [records, setRecords], error: [errMsg, setErrMsg], loading: [isLoading, setIsLoading]}} />;
}