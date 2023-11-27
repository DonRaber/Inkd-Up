import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageChanger = ({ handleAvatarChange, avatar }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handlePatchRequest = (e) => {
        const newImage = e.target.files[0];
        if (avatar !== null && avatar !== undefined) {
            handleAvatarChange(avatar, newImage)
            console.log(newImage)
        } else {
            console.error('Avatar is null or undefined. Unable to update image.');
        }
        setModalIsOpen(false);
    };

    return (
        <div>
            <button onClick={() => setModalIsOpen(true)}>Update Image</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Image Updater"
            >
                {/* Add your image selection UI here */}
                <input type="file" onChange={(e) => handlePatchRequest(e.target.files[0])} />
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>
    )
}

export default ImageChanger;