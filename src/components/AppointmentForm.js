import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

function AppointmentForm() {
    const initialValues = {
        date: '',
        time: '',
        artist: '',
        location: '',
    }

    const validationSchema = Yup.object({
        date: Yup.date().required('Date is required'),
        time: Yup.string().required('Time is required'),
        artist: Yup.string().required('Artist is required'),
        location: Yup.string().required('Location is required'),
    })

    const submitAppointment = (values) => {
        fetch('/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: values.date,
                time: values.time,
                // Need to fill with useState
                artist_id: artist_id,
                client_id: client_id,
                shop_id: shop_id
            })
        })
            .then((resp) => {
                if (resp.ok) {
                    resp.json().then(alert('Appointment created succesfully!'))
                    history.push('/account_home')
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        console.log(values)
    }

    return (<>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitAppointment}
        >
            <Form>
                <div>
                    <label htmlFor='date'>Date:</label>
                    <Field type='date' id='date' name='date' />
                    <ErrorMessage name='date' component='div' />
                </div>
                <div>
                    <label htmlFor='time'>Time:</label>
                    <Field type='time' id='time' name='time' />
                    <ErrorMessage name='time' component='div' />
                </div>

                <button type='submit'>Set Appointment</button>
            </Form>

        </Formik>
    </>)
}

export default AppointmentForm