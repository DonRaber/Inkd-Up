import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function RegisterShop({ id, username }) {

// USE STATE AND VALIDATION

const history = useHistory()
const [message, setMessage] = useState('');

const initialValues = {
    name: '',
    location: '',
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
})

// SUBMIT REGISTRATION FORM

const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values)
    try {
        const response = await fetch('/shops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: values.name,
                location: values.location,
                user_id: id,
            }),
        })

        if (response.ok) {
            setMessage('Shop added successfully')
            setTimeout(() => {
                history.push(`/account_home/${username}`)
            }, 2000);
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } else {
            const error = await response.json()
            console.error('Shop signup failed:', error)
        }
    } catch (error) {
        console.error('Error during Shop signup:', error)
    }

    setSubmitting(false);
}

// JSX

return (
    <div>
        <h1 className="title">Register as Shop</h1>
        {message ? (
            <div>
                <div>{message}</div>
            </div>
        ) : (
            <div id="registration">
                <div>Register Shop: </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <br />
                        <div>
                            <label htmlFor="name">Shop Name:</label>
                            <Field type="text" id="name" name="name" />
                            <ErrorMessage name="name" component="div" />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="location">Shop Location:</label>
                            <Field type="text" id="location" name="location" />
                            <ErrorMessage name="location" component="div" />
                        </div>
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


export default RegisterShop