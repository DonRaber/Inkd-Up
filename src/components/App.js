import { Route, Switch } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Fetch from './Fetch';
import LoginForm from './LoginForm';

function App(){
    const [clients, setClients] = useState([])
    const [artists, setArtists] = useState([])
    const [shops, setShops] = useState([])
    const [users, setUsers] = useState([])

    console.log(clients)
    console.log(artists)
    console.log(shops)
    console.log(users)

    return (
        <div>
            <h1>React Started</h1>
            <Fetch 
            setClients = {setClients}
            setArtists = {setArtists}
            setShops = {setShops}
            setUsers = {setUsers}
            />
            <LoginForm clients={clients}/>
        </div>
    )
}

export default App