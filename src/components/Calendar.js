import React, { useState } from "react";

const Calendar = ({ appointments }) => {

// USE STATE AND VARIABLES

    const [date, setDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(null)

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const startOfMonth = () => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

// GENERATE CALENDAR

    const generateCalendar = () => {
        const totalDays = daysInMonth(date.getMonth(), date.getFullYear())
        const startDay = startOfMonth()

        const calendar = []
        let day = 1

        for (let i = 0; i < startDay; i++) {
            calendar.push(<div key={`empty-${i}`} className="empty-cell"></div>)
        }

        for (let i = 1; i <= totalDays; i++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), i)
            const isAppointmentDay = appointments.some((appointment) => {
                const appointmentDate = new Date(appointment.date);
                return (
                    appointmentDate.getFullYear() === currentDate.getFullYear() &&
                    appointmentDate.getMonth() === currentDate.getMonth() &&
                    appointmentDate.getDate() === currentDate.getDate()
                )
            })

            const isSelected = selectedDay === i

            calendar.push(
                <div
                    key={i}
                    className={`calendar-cell ${isAppointmentDay ? "has-appointment" : ""} ${isSelected ? "selected" : ""
                        }`}
                    onClick={() => handleDayClick(i)}
                >
                    {i}
                </div>
            )
            day++
        }

        return calendar
    }

// DAY SELECTOR

    const handleDayClick = (day) => {
        setSelectedDay(day)
    }

    const closeModal = () => {
        setSelectedDay(null)
    }

    const selectedAppointmentDetails = appointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.date)
            return (
                appointmentDate.getFullYear() === date.getFullYear() &&
                appointmentDate.getMonth() === date.getMonth() &&
                appointmentDate.getDate() === selectedDay
            )
        })
        .map((appointment) => (
            <div key={appointment.id} className="appointment-details">
                <p>{appointment.time}</p>
                <p>{appointment.client_id}</p>
            </div>
        ))

// SWITCH MONTHS

    const goToPrevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()))
    }

    const goToNextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()))
    }

// JSX

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={goToPrevMonth}>&lt;</button>
                <h2>{new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
                <button onClick={goToNextMonth}>&gt;</button>
            </div>
            <div className="day-labels">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>
            <div className="calendar-grid">{generateCalendar()}</div>
            {selectedDay && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>{`${new Date(date.getFullYear(), date.getMonth(), selectedDay).toLocaleDateString(
                            "en-US"
                        )}'s Appointments`}</h2>
                        {selectedAppointmentDetails.length > 0 ? (
                            selectedAppointmentDetails
                        ) : (
                            <p>No appointments for this day.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calendar;