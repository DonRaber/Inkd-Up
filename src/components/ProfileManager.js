import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UserEdit from "./UserEdit";
import ArtistEdit from "./ArtistEdit";
import ShopEdit from "./ShopEdit";

function ProfileManager({ loggedIn, setLoggedIn, setUsers, setArtists, setShops }) {
    const [isUser, setIsUser] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isArtist, setIsArtist] = useState(false)
    const [isShop, setIsShop] = useState(false)

    console.log(loggedIn)

    return (
        <div>
            <div>
            <button onClick={() => setIsUser(!isUser)} >Edit User</button>
                { isUser ? (<UserEdit
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    setUsers={setUsers}
                />) : null }
            </div>
            <div>
            <button onClick={() => setIsArtist(!isArtist)} >Edit Artist</button>
                { isArtist ? (<ArtistEdit
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    setArtists={setArtists}
                />) : null }
            </div>
            <div>
            <button onClick={() => setIsShop(!isShop)} >Edit Shop</button>
                { isShop ? (<ShopEdit
                    loggedIn={loggedIn}
                    setLoggedIn={setLoggedIn}
                    setShops={setShops}
                />) : null }
            </div>
        </div>
    )
}

export default ProfileManager