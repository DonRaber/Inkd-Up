import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ShopEdit({ id, username, shopInfo, setShops }) {
    const history = useHistory()
    const [message, setMessage] = useState('');
    console.log(shopInfo[0].location)

    const initialValues = {
        name: `${shopInfo[0].name}`,
        location: `${shopInfo[0].location}`,
    };


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        location: Yup.string().required('Required'),
    });
    const handleSubmit = async (values, { setSubmitting }) => {
        console.log(values)
        try {
            const response = await fetch(`/shops/user_${id}`, {
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
                    history.push(`/account_home/${username}`);
                }, 2000);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                const error = await response.json();
                console.error('Artist update failed:', error);
            }
        } catch (error) {
            console.error('Error during Artist update:', error);
        }

        setSubmitting(false);
    }


    function handleDeleteShop(id) {
        fetch(`/shops/${id}`, { method: "DELETE" }).then((resp) => {
            console.log(resp)
            if (resp.ok) {
                setShops((shopArr) =>
                    shopArr.filter((shop) => shop.id !== id)
                );
                alert(`shop ${shopInfo[0].name} Deleted!`)
                history.push('/')
            }
        });
    }


    return (
        <div>
            <div>
                <h1>Edit Shop Here</h1>
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
                                <label htmlFor="name">Name:</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="location">Location:</label>
                                <Field type="location" id="location" name="location" />
                                <ErrorMessage name="location" component="div" />
                            </div>
                            <br />
                            <div>
                                <button type="submit">Save Changes</button>
                            </div>
                        </Form>
                    </Formik>
                    <button on onClick={() => handleDeleteShop(id)}>Delete User</button>
                </div>
            )}
        </div>
    )
}

export default ShopEdit