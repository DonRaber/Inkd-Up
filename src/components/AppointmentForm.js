import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

function AppointmentForm({loggedIn, artsits, shops}) {
    // const [artistSearch, setArtistSearch] = useState({})
    // const [shopSearch, setShopSearch] = useState({})
    const initialValues = {
        date: '',
        time: '',
        artist: '',
        location: '',
    }

    const history = useHistory()

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
                artist_id: values.artist_id,
                client_id: loggedIn.client[0].id,
                shop_id: values.shop_id
            })
        })
            .then((resp) => {
                if (resp.ok) {
                    resp.json().then(alert('Appointment created succesfully!'))
                    history.push('/userprofile/:username')
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        console.log(values)
    }

    // console.log(loggedIn.client[0].id)
    // console.log(artistSearch)
    // console.log(shopSearch)

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
                <div>
                    <label htmlFor='artist_id'>Artist:</label>
                    <Field type='artist_id' id='artist_id' name='artist_id' />
                    <ErrorMessage name='artist_id' component='div' />
                </div>
                <div>
                    <label htmlFor='shop_id'>Shop:</label>
                    <Field type='shop_id' id='shop_id' name='shop_id' />
                    <ErrorMessage name='shop_id' component='div' />
                </div>

                <button type='submit'>Set Appointment</button>
            </Form>

        </Formik>
    </>)
}

export default AppointmentForm