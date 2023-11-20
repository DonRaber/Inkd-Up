import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Fetch from './Fetch';
import LoginForm from './LoginForm';
import AppointmentForm from './AppointmentForm';
import Profile from './Profile';
import ProfileManager from './ProfileManager';
import Registration from './Registration';

function App() {
    const [clients, setClients] = useState([])
    const [artists, setArtists] = useState([])
    const [shops, setShops] = useState([])
    const [users, setUsers] = useState([])
    const [loggedIn, setLoggedIn] = useState({})

    const currentProfile = users.filter(user => {
        return user.username.includes(loggedIn.username)
    })

    const userProfile = currentProfile.map((profile) => {
        return <Profile
            key={profile.id}
            username={profile.username}
            email={profile.email}
            avatar={profile.profilePic}
            artistInfo={profile.artist}
            clientInfo={profile.client}
            shopInfo={profile.shop}
        />
    })

    console.log(clients)
    console.log(artists)
    console.log(shops)
    console.log(users)
    console.log(loggedIn)
    // console.log(currentProfile[0].artist.length)

    return (
        <div>
            <h1>React Started</h1>
            <Fetch
                setClients={setClients}
                setArtists={setArtists}
                setShops={setShops}
                setUsers={setUsers}
            />
            <Link to='/account_home'><button>Next Page</button></Link>
            <Switch>
                <Route exact path='/'>
                    <h1>Homepage(includes: Overview)</h1>
                </Route>
                <Route exact path='/login'>
                    <LoginForm users={users} setLoggedIn={setLoggedIn} />
                </Route>
                <Route exact path='/registration'>
                    <h1>Register For new Account</h1>
                    <Registration />
                </Route>
                <Route exact path='/account_home/'>
                    {userProfile}
                </Route>
                <Route exact path='/user_profile/:username'>
                    <h1>User Profile by Username</h1>
                    <Profile artists={artists} />
                </Route>
                <Route exact path='/profile_editor'>
                    <h1>Edit account info : Patch Request to Login info or Account Info(Patch request for Specific Profile Type)</h1>
                </Route>
                <Route exact path='/book_appointment'>
                    <h1>Appointment Registration Form</h1>
                    <AppointmentForm
                        loggedIn={loggedIn}
                        artists={artists}
                        shops={shops}
                    />
                </Route>
                <Route exact path='/profile_manager'>
                    <ProfileManager />
                </Route>
            </Switch>
        </div>
    )
}

export default App