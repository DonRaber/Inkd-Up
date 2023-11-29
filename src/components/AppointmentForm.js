import React from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

function AppointmentForm({ loggedIn, currentArtist, shops }) {
    const initialValues = {
        date: '',
        time: '',
        shop_id: '', 
    };

    const history = useHistory();

    const validationSchema = Yup.object({
        date: Yup.date().required('Date is required'),
        time: Yup.string().required('Time is required'),
        shop_id: Yup.string().required('Shop is required'),
    });

    const submitAppointment = async (values, { setSubmitting }) => {
        console.log(values)
        try {
            const response = await fetch('/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: values.date,
                    time: values.time,
                    artist_id: currentArtist.id,
                    client_id: loggedIn.client[0].id,
                    shop_id: values.shop_id,
                }),
            });

            if (response.ok) {
                await response.json();
                alert('Appointment created successfully!');
                history.push(`/account_home/${loggedIn.username}`);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {loggedIn ? (
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
                            <label htmlFor='shop_id'>Shop:</label>
                            <Field as='select' id='shop_id' name='shop_id'>
                                {shops.map(shop => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name='shop_id' component='div' />
                        </div>
                        <button className="submit_button" type='submit'>Confirm Appointment</button>
                    </Form>
                </Formik>
            ) : (
                <h3>Please Login To Set Appointment</h3>
            )}
        </div>
    );
}

export default AppointmentForm;