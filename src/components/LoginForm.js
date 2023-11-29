import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => {

    const [message, setMessage] = useState('');


    const initialValues = {
        username: '',
        password: '',
    };
    const history = useHistory()

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Send login request to your backend
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const user = await response.json();
                setMessage('Loggin in, Redirecting to home...')
                setTimeout(() => {
                history.push(`/account_home/${user.username}`)
                }, 2000)
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                const error = await response.json();
                console.error('Login failed:', error);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }

        setSubmitting(false);
    };

    return (
        <div id='login'>
            {message ? (<div>{message}</div>) :(
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form>
                <br />
                <div>
                    <label htmlFor="username">Username:</label>
                    <Field type="username" id="username" name="username" />
                    <ErrorMessage name="username" component="div" />
                </div>
                <br />
                <div>
                    <label htmlFor="password">Password:</label>
                    <Field type="password" id="password" name="password" />
                    <ErrorMessage name="password" component="div" />
                </div>
                <br />
                <div>

                    <button className="submit_button" id='login_button' type="submit">Login</button>
                </div>
            </Form>
        </Formik>
        )}
        </div>
    );
};

export default LoginForm;