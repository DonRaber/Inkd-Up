import { Route, Switch } from 'react-router-dom';
import React, { useState } from "react";
import Fetch from './Fetch';
import LoginForm from './LoginForm';
import AppointmentForm from './AppointmentForm';
import ProfileManager from './ProfileManager';
import Registration from './Registration';
import Navbar from './NavBar';
import ProfilePreview from './ProfilePreview';
import Profile from './Profile';
import Search from './Search';
import { useTheme } from '../ThemContext';

function App() {

// STATE SETTERS AND GETTERS

    const [clients, setClients] = useState([])
    const [artists, setArtists] = useState([])
    const [shops, setShops] = useState([])
    const [users, setUsers] = useState([])
    const [loggedIn, setLoggedIn] = useState(null)
    const { backgroundColor, toggleBackgroundColor } = useTheme();

// MAPS AND FILTERS

    const currentProfile = users.filter(user => {
        if (loggedIn) {
            return user.username === (loggedIn.username)
        } else {
            return null
        }
    })

    const userProfile = currentProfile.map((profile) => {
        return <ProfilePreview
            key={profile.id}
            id={profile.id}
            username={profile.username}
            email={profile.email}
            avatar={profile.profilePic}
            artistInfo={profile.artist}
            clientInfo={profile.client}
            shopInfo={profile.shop}
        />
    })
    const profileEditor = currentProfile.map((profile) => {
        return <ProfileManager
            key={profile.id}
            id={profile.id}
            username={profile.username}
            password={profile.password}
            email={profile.email}
            artistInfo={profile.artist}
            clientInfo={profile.client}
            shopInfo={profile.shop}
            setUsers={setUsers}
            setArtists={setArtists}
            setShops={setShops}
            setClients={setClients}
        />
    })

// JSX

    return (
        <div
            className="app-container"
            style={{
                backgroundColor,
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Kaushan Script, cursive',
            }}
        >
            <div id='main_page'>
                <Navbar loggedIn={loggedIn} />
                <Fetch
                    setClients={setClients}
                    setArtists={setArtists}
                    setShops={setShops}
                    setUsers={setUsers}
                    setLoggedIn={setLoggedIn}
                />
                <button id='background_button' onClick={toggleBackgroundColor}>Toggle Background Color</button>
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
                                <p><b> But…</b></p>
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
                        <Registration
                            setLoggedIn={setLoggedIn}
                        />
                    </Route>
                    <Route exact path='/account_home/:username'>
                        {userProfile}
                    </Route>
                    <Route exact path='/user_profile/:username'>
                        <Profile artists={artists} loggedIn={loggedIn} shops={shops} clients={clients} />
                    </Route>
                    <Route exact path='/profile_search'>
                        <Search users={users} loggedIn={loggedIn} />
                    </Route>
                    <Route exact path='/user_profile/:username/book_appointment'>
                        <h1>Appointment Registration Form</h1>
                        <AppointmentForm
                            loggedIn={loggedIn}
                            shops={shops}
                        />
                    </Route>
                    <Route exact path='/profile_manager'>
                        {profileEditor}
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default App