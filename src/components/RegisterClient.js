import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function RegisterClient({ id, username }) {

// USE STATE AND VALIDATION

    const history = useHistory()
    const [message, setMessage] = useState('');

    const initialValues = {
        name: '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    })

    // SUBMIT REGISTRATION FORM

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log(values)
        try {
            const response = await fetch('/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    user_id: id,
                }),
            })

            if (response.ok) {
                setMessage('Client added successfully')
                setTimeout(() => {
                    history.push(`/account_home/${username}`)
                }, 2000);
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                const error = await response.json()
                console.error('Client signup failed:', error)
            }
        } catch (error) {
            console.error('Error during Client signup:', error)
        }

        setSubmitting(false);
    }

    // JSX

    return (
        <div>
            <h1 className="title">Register as Client</h1>
            {message ? (
                <div>
                    <div>{message}</div>
                </div>
            ) : (
                <div id="registration">
                    <div>Register Client: </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <br />
                            <div>
                                <label htmlFor="name">Full Name:</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" />
                            </div>
                            <br />
                            <div>
                                <button className="submit_button" type="submit">Sign Up</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            )}
        </div>
    )
}


export default RegisterClient