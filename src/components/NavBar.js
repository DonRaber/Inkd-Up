import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Navbar({ loggedIn }) {

// USE STATE AND VARIABLES

    const [toggle, setToggle] = useState(true)
    const history = useHistory()

// EVENT HANDLERS

    function toggleNav(e) {
        setToggle(!toggle)
        console.log('clicked')
    }

// LOGOUT

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.status === 204) {
                console.log('Logout successful')
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
                history.push('/')
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

// NAVBAR TOGGLE AND CONDITIONAL RENDERS

    const nav = (toggle ?
        <img id='logo' src='/Nav_Logo2.jpg' alt='Inkd Up' onClick={toggleNav} /> :
        <nav id="navbar" >
            <div className="navbar">
                <img id='logo' src='/Nav_Logo.jpeg' alt='Inkd Up' onClick={toggleNav} />
                <NavLink className='link' to="/" activeClassName="active">Home</NavLink>
                {loggedIn ? <span className="link" onClick={handleLogout}>Logout</span> : <NavLink className='link' to="/login" activeClassName="active" >Login</NavLink>}
                <NavLink className='link' to="/registration" activeClassName="active" >Register</NavLink>
                {loggedIn ? <NavLink className='link' to='/account_home/:username' activeClassName="active">Account</NavLink>: null}
                <NavLink className='link' to='/profile_search' activeClassName="active">Search</NavLink>
            </div>
        </nav>)



// JSX

    return (
        <div id="navarea">
            {nav}
        </div>
    );
}

export default Navbar;