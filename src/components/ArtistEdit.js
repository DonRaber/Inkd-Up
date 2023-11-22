import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ArtistEdit({ loggedIn, setLoggedIn }) {
    const history = useHistory()
    const [message, setMessage] = useState('');

    const initialValues = {
        name: `${loggedIn.artist[0].name}`,
    };

    console.log(loggedIn.id)

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });
    console.log(loggedIn.id)
    const handleSubmit = async (values, { setSubmitting }) => {
        console.log(values)
        try {
            const response = await fetch(`/artists/user_${loggedIn.id}`, {
                method: 'PATCH',
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


    function handleDeleteArtist(id) {
        fetch(`/artists/user_${id}`, { method: "DELETE" }).then((resp) => {
            console.log(resp)
            if (resp.ok) {
                setArtists((artists) =>
                    artists.filter((artist) => artist.user_id !== id)
                );
                alert(`Artist: ${artist.name} Deleted!`)
                history.push('/')
            }
        });
    }


    return (
        <div>
            <div>
                <h1>Edit Artist Here</h1>
            </div>

            {message ? (
                <div>
                    <div>{message}</div>
                </div>
            ) : (
                <div>
                    <div>Edit Artist Info: </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <br />
                            <div>
                                <label htmlFor="Name">Name:</label>
                                <Field type="text" id="Name" name="Name" />
                                <ErrorMessage name="Name" component="div" />
                            </div>
                            <br />
                            <div>
                                <button type="submit">Save Changes</button>
                            </div>
                        </Form>
                    </Formik>
                    <button on onClick={() => handleDeleteArtist(loggedIn.id)}>Delete Artist</button>
                </div>
            )}
        </div>
    )
}

export default ArtistEdit