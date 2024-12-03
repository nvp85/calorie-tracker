import React, { useState } from "react";
import "./FoodSearch.css"
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "../../hooks/AuthProvider";


export default function FoodSearch() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState('');
    const auth = useAuth();

    async function search(e) {
        e.preventDefault();
        if (query === '') {
            setMessage("Enter a food's name, please. For example, banana.");
            return;
        }
        setSearchResults([]);
        setMessage("Searching...");
        try {
            const res = await fetch(`api/food?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: auth.user ? {
                    "authentication": auth.user.token,
                } : {}
            });
            const data = await res.json();
            if (!res?.ok) {
                if (data.errors) {
                    throw new Error(data.errors.reduce((msg, err) => msg + " " + err));
                } else {
                    throw new Error(`HTTP response code: ${res.status}`);
                }
            }
            if (data.length === 0) {
                setMessage('Sorry, nothing was found.');
            } else {
                setMessage('');
                setSearchResults(data.map(item => {
                    return (
                        <div className="search-food-item" key={item.id}>
                            <div>
                                <p>{item.name}</p>
                                <p className="gray-text">Calories, per 100g: {item.calories}</p>
                            </div>
                            <Link to={`/food/${item.id}`} className="food-select-btn"><LuPlus className="circle-icon"/></Link>
                        </div>
                    )
                }));
            }
        } catch (err) {
            console.error('Fail to fetch data.', err);
            setMessage('Failed to perform the search. Please try again.');
        }
    };

    if (auth.loading) {
        return (
            <div className="white-container">
                <h2 className="gray-text">Loading user's details...</h2>
            </div>
    )};

    return (
        <div className="white-container">
            <h2>Search a food item by name</h2>
            <form onSubmit={search}>
                <input type="text" className="input-box" name="query" value={query} onChange={(e)=>setQuery(e.target.value)}/>
                <button type="submit" className="input-btn ">search</button>
            </form>
            {message && <p className="message">{message}</p>}
            <div className="search-results">
                {searchResults.length>0 && searchResults}
            </div>
        </div>
    )
};