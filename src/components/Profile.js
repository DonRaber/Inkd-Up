import React, { useState } from "react";
import Calendar from "./Calendar";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AppointmentForm from "./AppointmentForm";

function Profile({ artists, loggedIn, shops, clients }) {

    // USE STATE AND PARAMS

    const { username } = useParams()
    const [toggleAppt, setToggleAppt] = useState(false)
    const currentArtist = artists.find((artist) => artist.user.username === username);
    console.log(currentArtist)

    const appointments = currentArtist ? currentArtist.appointments || [] : [];

    const today = new Date();
    const todayAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
            appointmentDate.getUTCDate() === today.getUTCDate() &&
            appointmentDate.getUTCMonth() === today.getUTCMonth() &&
            appointmentDate.getUTCFullYear() === today.getUTCFullYear()
        );
    });

    // JSX

    return (<div>
        <h1>{username}</h1>
        <div>
            <h2>{username}'s Appointments</h2>
            {appointments.length > 0 ? (
                <ul>
                    {todayAppointments
                        .sort((a, b) => {
                            const timeA = new Date(`${a.date} ${a.time}`).getTime();
                            const timeB = new Date(`${b.date} ${b.time}`).getTime();
                            return timeA - timeB;
                        })
                        .map((appointment) => (
                            <li key={appointment.id}>
                                Date: {appointment.date}, Time: {appointment.time}
                            </li>
                        ))}
                </ul>
            ) : (
                <p>No appointments for {username}.</p>
            )}
        </div>
        <Calendar appointments={appointments} clients={clients} />
        <button className="submit_button" onClick={() => setToggleAppt(!toggleAppt)} >Set Appointment</button>
        {toggleAppt ? <AppointmentForm currentArtist={currentArtist} loggedIn={loggedIn} shops={shops} /> : null}
    </div>
    )
}

export default Profile