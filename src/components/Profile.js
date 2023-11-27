import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ImageChanger from "./ImageChanger";


function Profile({ id, username, email, avatar, artistInfo, clientInfo, shopInfo }) {
    const [edit, setEdit] = useState(false)
    const history = useHistory()

    console.log(username)
    console.log(email)
    console.log(avatar)
    console.log(artistInfo)
    console.log(clientInfo)
    console.log(shopInfo)


    let client = []
    if (Array.isArray(clientInfo) && clientInfo.length >= 1) {
        const client = clientInfo.map(client => {
            return client.name
    })} else {
        console.log('empty array')
    } 

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.status === 204) {
                console.log('Logout successful')
                history.push('/')
                setTimeout(() => {
                    window.location.reload()
                }, 1)
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    const handleAvatarChange = async (currentAvatar, newImage) => {
        const userId = id; // Replace with the actual user ID
        const apiUrl = '/upload_profile_picture';
    
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('image', newImage);
    
        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Upload successful:', data);
        } catch (error) {
            console.error('Error during upload:', error.message);
        }
    
        console.log('PATCH request with new image:', newImage);
    }



    return (
        <div>
            <h1>Welcome, {username}!</h1>
            {client? <h2>{client}</h2> : null}
            <img className="preview_photo" src={avatar} alt='Set Avatar Picture' />
            <ProfileCard username={username} avatar={avatar} />
            <Link to='/profile_manager' ><button >Edit Profile</button></Link>
            <h1>{email}</h1>
            <ImageChanger handleAvatarChange={handleAvatarChange} avatar={avatar}/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Profile