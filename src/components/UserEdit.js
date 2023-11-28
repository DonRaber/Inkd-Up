import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function UserEdit({ id, username, email, password, setUsers }) {
    const history = useHistory()
    const [message, setMessage] = useState('');

    const initialValues = {
        username: `${username}`,
        email: `${email}`,
        password: `${password}`,
        confirmPassword: `${password}`,
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
        console.log(values)
        try {
            const response = await fetch(`/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setMessage('Update successful. Redirecting to home...');
                setTimeout(() => {
                    history.push(`/account_home/${updatedUser.username}`);
                }, 2000);
                setTimeout(() => {
                    window.location.reload();
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


    function handleDeleteUser(id) {
        fetch(`/users/${id}`, { method: "DELETE" }).then((resp) => {
            console.log(resp)
            if (resp.ok) {
                setUsers((userArr) =>
                    userArr.filter((user) => user.id !== id)
                );
                alert(`user ${loggedIn.username} Deleted!`)
                history.push('/')
            }
        });
    }


    return (
        <div>
            <div>
                <h1>Edit Info Here</h1>
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
                    <button on onClick={() => handleDeleteUser(id)}>Delete User</button>
                </div>
            )}
        </div>
    )
}

export default UserEdit