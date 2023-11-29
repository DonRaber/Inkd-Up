import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ArtistEdit({ id, username, clientInfo }) {
    const history = useHistory()
    const [message, setMessage] = useState('');

    const initialValues = {
        name: `${clientInfo[0].name}`,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`/clients/user_${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setMessage('Update successful. Redirecting to home...');
                setTimeout(() => {
                    history.push(`/account_home/${username}`);
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


    function handleDeleteClient(id) {
        fetch(`/clients/user_${id}`, { method: "DELETE" }).then((resp) => {
            console.log(resp)
            if (resp.ok) {
                setClients((clients) =>
                    clients.filter((client) => client.user_id !== id)
                );
                alert(`Artist: ${client.name} Deleted!`)
                history.push('/')
            }
        });
    }


    return (
        <div>
            <div>
                <h1>Edit Client Here</h1>
            </div>

            {message ? (
                <div>
                    <div>{message}</div>
                </div>
            ) : (
                <div>
                    <div>Edit Client Info: </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <br />
                            <div>
                                <label htmlFor="name">Name:</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" />
                            </div>
                            <br />
                            <div>
                                <button type="submit">Save Changes</button>
                            </div>
                        </Form>
                    </Formik>
                    <button on onClick={() => handleDeleteClient(loggedIn.id)}>Delete Artist</button>
                </div>
            )}
        </div>
    )
}

export default ArtistEdit