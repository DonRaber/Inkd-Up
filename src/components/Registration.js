import React, {useState} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Registration({setLoggedIn}) {

    const history = useHistory()
    const [message, setMessage] = useState('');



    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (response.ok) {
                const newUser = await response.json();
                setMessage('Login successful. Redirecting to home...');
                setLoggedIn(newUser)
                setTimeout(() => {
                    history.push(`/account_home/${newUser.username}`);
                }, 2000);
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                const error = await response.json();
                console.error('User signup failed:', error);
            }
        } catch (error) {
            console.error('Error during User signup:', error);
        }

        setSubmitting(false);
    }

    return (
        <div>
            <h1 className="title">Register For new Account</h1>
            {message ? (
                <div>
                    <div>{message}</div>
                </div>
            ) : (
                <div id="registration">
                    <div>Register User: </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <br />
                            <div>
                                <label htmlFor="username">Username:</label>
                                <Field type="text" id="username" name="username" />
                                <ErrorMessage name="username" component="div" />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="email">Email:</label>
                                <Field type="email" id="email" name="email" />
                                <ErrorMessage name="email" component="div" />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="password">Password:</label>
                                <Field type="password" id="password" name="password" />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <Field type="password" id="confirmPassword" name="confirmPassword" />
                                <ErrorMessage name="confirmPassword" component="div" />
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


export default Registration