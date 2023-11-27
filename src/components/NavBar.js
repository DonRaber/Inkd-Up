import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {

    const [toggle, setToggle] = useState(true)
    // const [searchToggle, setToggleSearch] = useState(false)


    function toggleNav(e) {
        setToggle(!toggle)
        console.log('clicked')
    }
    // function toggleSearch(e) {
    //     e.preventDefault()
    //     setToggleSearch(!searchToggle)
    //     console.log('clicked')
    // }

    

    const nav = (toggle ? <img id='logo' src='/Nav_Logo2.jpg' alt='Inkd Up' onClick={toggleNav} /> :
        <nav id="navbar" >
            <div className="navbar">
                <img id='logo' src='/Nav_Logo.jpeg' alt='Inkd Up' onClick={toggleNav} />
                <NavLink className='link' to="/" activeClassName="active">Home</NavLink>
                <NavLink className='link' to="/login" activeClassName="active" >Login</NavLink>
                <NavLink className='link' to="/registration" activeClassName="active" >Register</NavLink>
                <NavLink className='link' to='/account_home/:username' activeClassName="active">Account</NavLink>
                {/* {storeLogged &&
                    <NavLink className='link' to="/customers" activeClassName="active" >Clients</NavLink>} */}
            </div>
        </nav>)




    // console.log(toggle)

    return (
        <div id="navarea">
            {/* <button className="login-butt" onClick={toggleSearch}>Search</button> */}
            {/* {searchToggle ? <Search setSearchTerm={setSearchTerm} gamesArr={gamesArr} /> : null} */}
            {nav}
        </div>
    );
}

export default Navbar;