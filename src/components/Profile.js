import React, {useState} from "react";
import Calendar from "./Calendar";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AppointmentForm from "./AppointmentForm";

function Profile({ artists, loggedIn, shops }) {

// USE STATE AND PARAMS

    const { username } = useParams()
    const [toggleAppt, setToggleAppt] = useState(false)
    const currentArtist = artists.find((artist) => artist.user.username === username);

    const appointments = currentArtist ? currentArtist.appointments || []: [];

// JSX

    return (<div>
        <h1>{username}</h1>
        <div>
            <h2>{username}'s Appointments</h2>
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            Date: {appointment.date}, Time: {appointment.time}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No appointments for {username}.</p>
            )}
        </div>
        <Calendar appointments={appointments} />
        <button className="submit_button" onClick={() => setToggleAppt(!toggleAppt)} >Set Appointment</button>
        {toggleAppt ? <AppointmentForm currentArtist={currentArtist} loggedIn={loggedIn} shops={shops} />: null}
    </div>
    )
}

export default Profile