import React, { useState } from "react";
import ProfileCard from "./ProfileCard";

function Search({ users, loggedIn }) {

// USE STATE

    const [searchTerm, setSearchTerm] = useState("");

// SEARCH FILTER

    const filteredArtists = users
        .filter((user) => user.artist.length > 0)
        .filter((user) =>
            user.artist.some(
                (artist) =>
                    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

// JSX

    return (
        <div>
            <input
                type="text"
                placeholder="Find a link to ink"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div id="search_results">
                {filteredArtists.map((user) => (
                    <ProfileCard 
                    username={user.username} 
                    avatar={user.profilePic} />
                ))}
            </div>
        </div>
    );
}

export default Search;