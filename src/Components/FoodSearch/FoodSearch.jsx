import React, { useState } from "react";
import "./FoodSearch.css"
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";


export default function FoodSearch() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState('');

    function search(e) {
        e.preventDefault();
        if (query === '') {
            setMessage("Enter a food's name, please. For example, banana.");
        } else {
            setMessage("Searching...");
            fetch(`api/food?query=${encodeURIComponent(query)}`)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    setMessage('');
                    setSearchResults(data.foods.map(item => {
                        return (
                            <div className="search-food-item" key={item.id}>
                                <div>
                                    <p>{item.name}</p>
                                    <p className="search-item-calories">Calories, per 100g: {item.calories}</p>
                                </div>
                                <Link to={"/"} className="food-select-btn"><LuPlus className="add-icon"/></Link>
                            </div>
                        );
                    }));
                });
        };
    };

    return (
        <div className="search-container">
            <h2>Search a food item by name</h2>
            <form onSubmit={search}>
                <input type="text" className="search-box" name="query" value={query} onChange={(e)=>setQuery(e.target.value)}/>
                <button type="submit" className="search-btn ">search</button>
            </form>
            {message && <p className="message">{message}</p>}
            <div className="search-results">
                {searchResults.length ? searchResults : ""}
            </div>
        </div>
    )
};