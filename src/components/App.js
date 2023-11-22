import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Fetch from './Fetch';
import LoginForm from './LoginForm';
import AppointmentForm from './AppointmentForm';
import Profile from './Profile';
import ProfileManager from './ProfileManager';
import Registration from './Registration';
import Navbar from './NavBar';
// import { connect } from 'react-redux';
// import { fetchUserData } from '../store/actions'

function App() {
    const [clients, setClients] = useState([])
    const [artists, setArtists] = useState([])
    const [shops, setShops] = useState([])
    const [users, setUsers] = useState([])
    const [loggedIn, setLoggedIn] = useState({})

    // useEffect(() => {
    //     // Fetch user data when the component mounts
    //     fetchUserData();
    // }, [fetchUserData]);

    // const currentProfile = users.filter(user => {
    //     return user.username.includes(loggedIn.username)
    // })

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
            {/* <img id='logo' src='./Inkd_Up_logo.jpeg' alt='Inkd Up' /> */}
            <Navbar />
            <Fetch
                setClients={setClients}
                setArtists={setArtists}
                setShops={setShops}
                setUsers={setUsers}
                setLoggedIn={setLoggedIn}
            />
            <Switch>
                <Route exact path='/'>
                    <div id='overview_container' align='center'>
                        <h1>Overview</h1>
                        <div id='overview_text_container'>
                            <p>Ink'd Up is the ultimate platform designed exclusively for the vibrant world of tattoo artistry.</p>
                            <br />
                            <p>With a mission is to revolutionize the way tattoo artists, clients, and tattoo shops connect and collaborate.</p>
                            <br />
                            <p>We provide an intuitive, all-in-one solution to simplify the process of connecting with the perfect tattoo artist, scheduling appointments and consultations, and a place for artists to foster opportunities for upcoming artists and apprentices to thrive in the industry.</p>
                            <br />
                            <p> But…</p>
                            <br />
                            <p>Ink'd Up isn't just for clients finding the right artist, it's a virtual space where tattoo artists of all backgrounds, styles, and disciplines can come together to connect, collaborate, and find inspiration in the world of art.
                            </p>
                        </div>
                    </div>
                </Route>
                <Route exact path='/login'>
                    <LoginForm users={users} setLoggedIn={setLoggedIn} />
                </Route>
                <Route exact path='/registration'>
                    <h1>Register For new Account</h1>
                    <Registration
                        setLoggedIn={setLoggedIn}
                    />
                </Route>
                <Route exact path='/account_home/:username'>
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
                    <ProfileManager
                        loggedIn={loggedIn}
                        setLoggedIn={setLoggedIn}
                        setUsers={setUsers}
                        setArtists={setArtists}
                        setShops={setShops}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default App