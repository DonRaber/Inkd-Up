import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ProfileCard({username, avatar}){

// JSX

    return (
    <div className="profile_card">
        <Link className='card_name' to={`/user_profile/${username}`}><h1>{username}</h1></Link>
        <img className="preview_photo" src={avatar} alt="Unavailable" />
    </div>
    )
}

export default ProfileCard