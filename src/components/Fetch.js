import React, { useEffect} from "react";

function Fetch({setClients, setArtists, setShops, setUsers, setLoggedIn}){

    useEffect(() => {
        fetch('/clients')
            .then((resp) => resp.json())
            .then(setClients)
    }, [])

    useEffect(() => {
        fetch('/artists')
            .then((resp) => resp.json())
            .then(setArtists)
    }, [])

    useEffect(() => {
        fetch('/shops')
            .then((resp) => resp.json())
            .then(setShops)
    }, [])

    useEffect(() => {
        fetch('/users')
            .then((resp) => resp.json())
            .then(setUsers)
    }, [])

    useEffect(() => {
        fetch('/check_session')
        .then((resp) => {
            if (resp.ok) {
                resp.json().then((data) => setLoggedIn(data))
            }
        })
    }, [])

    return <></>
}

export default Fetch