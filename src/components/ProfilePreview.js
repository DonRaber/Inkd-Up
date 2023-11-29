import React from "react";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ImageChanger from "./ImageChanger";


function ProfilePreview({ id, username, email, avatar, artistInfo, clientInfo, shopInfo }) {
    const history = useHistory()

    console.log(artistInfo)
    console.log(clientInfo)
    console.log(shopInfo)


    let client = []
    if (Array.isArray(clientInfo) && clientInfo.length >= 1) {
        client = clientInfo.map(client => {
            return client.name
    })} else {
        client = false
    } 

    let artist = []
    if (Array.isArray(artistInfo) && artistInfo.length >= 1) {
        artist = artistInfo.map(artist => {
            return artist.name
    })} else {
        artist = false
    } 

    let shop = []
    if (Array.isArray(shopInfo) && shopInfo.length >= 1) {
        shop = shopInfo.map(shop => {
            return shop.name
    })} else {
        shop = false
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
        const userId = id
        const apiUrl = '/upload_profile_picture';

        console.log(newImage)
    
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
            {client? <h2>{`Client Name: ${client}`}</h2> : null}
            {artist? <h2>{`Artist Name: ${artist}`}</h2> : null}
            {shop? <h2>{`Shop Name: ${shop}`}</h2> : null}
            <img className="preview_photo" src={avatar} alt='Set Avatar Picture' />
            <ProfileCard username={username} avatar={avatar} />
            <Link to='/profile_manager' ><button >Edit Profile</button></Link>
            <h1>{email}</h1>
            <ImageChanger handleAvatarChange={handleAvatarChange} avatar={avatar}/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default ProfilePreview