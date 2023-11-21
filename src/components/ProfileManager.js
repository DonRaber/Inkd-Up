import React, {useState} from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ProfileManager({loggedIn, setLoggedIn}) {
    const history = useHistory()
    const [message, setMessage] = useState('');



    const initialValues = {
        username: `${loggedIn.username}`,
        email: `${loggedIn.email}`,
        password: `${loggedIn.password}`,
        confirmPassword: `${loggedIn.password}`, // New field for confirming the password
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });
    console.log(loggedIn.id)
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`/user/${loggedIn.id}`, {
                method: 'PATCH', // Change the method to PATCH
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                setMessage('Update successful. Redirecting to home...');
                setLoggedIn(updatedUser);
                setTimeout(() => {
                    history.push(`/account_home/${updatedUser.username}`);
                }, 2000);
            } else {
                const error = await response.json();
                console.error('User update failed:', error);
            }
        } catch (error) {
            console.error('Error during User update:', error);
        }
    
        setSubmitting(false);
    }

    return (
        <div>
            <div>
                <Link to='/account_home'><h1>Edit Info Here</h1></Link>
            </div>

            {message ? (
                <div>
                    <div>{message}</div>
                </div>
            ) : (
                <div>
                    <div>Edit Account: </div>
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
                                <button type="submit">Save Changes</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            )}
        </div>
    )


}

export default ProfileManager