import React, {useState} from "react";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Profile({ username, email, avatar, artistInfo, clientInfo, shopInfo }) {
    const [edit, setEdit] = useState(false)

    console.log(username)
    console.log(email)
    console.log(avatar)
    console.log(artistInfo)
    console.log(clientInfo)
    console.log(shopInfo)

    const client = clientInfo.map((client) => {
        return client.name
    })



    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <h2>{client}</h2>
            <Link to='/'><ProfileCard /></Link>
            <Link to='/profile_manager' ><button >Edit Profile</button></Link>
            <h1>{email}</h1>
            <img src={avatar} alt='Set Avatar Picture' />
        </div>
    )
}

export default Profile