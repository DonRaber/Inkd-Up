import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UserEdit from "./UserEdit";
import ArtistEdit from "./ArtistEdit";
import ShopEdit from "./ShopEdit";
import ClientEdit from "./ClientEdit";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ProfileManager({ setUsers, setArtists, setShops, id, username, password, email, artistInfo, clientInfo, shopInfo, setClients }) {
    const [isUser, setIsUser] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isArtist, setIsArtist] = useState(false)
    const [isShop, setIsShop] = useState(false)


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

    return (
        <div>
            <Link to='/' ><button>Return to Profile</button></Link>
            <div>
            <button onClick={() => setIsUser(!isUser)} >Edit User</button>
                { isUser ? (<UserEdit
                    id={id}
                    username={username}
                    email={email}
                    password={password}
                    setUsers={setUsers}
                />) : null }
            </div>
            {artist? <div>
            <button onClick={() => setIsArtist(!isArtist)} >Edit Artist</button>
                { isArtist ? (<ArtistEdit
                    setArtists={setArtists}
                />) : null }
            </div>: <button>Setup Artist</button>}
            {shop? <div>
            <button onClick={() => setIsShop(!isShop)} >Edit Shop</button>
                { isShop ? (<ShopEdit
                    setShops={setShops}
                />) : null }
            </div>: <button>Setup Shop</button>}
            {client? <div>
            <button onClick={() => setIsClient(!isClient)} >Edit Client</button>
                { isClient ? (<ClientEdit
                    setClients={setClients}
                />) : null }
            </div>: <button>Setup Client</button>}
        </div>
    )
}

export default ProfileManager