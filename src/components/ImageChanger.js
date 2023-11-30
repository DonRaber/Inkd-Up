import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageChanger = ({ handleAvatarChange, avatar }) => {

// USE STATE

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)

// HANDLE IMAGE CHANGE

    const handlePatchRequest = (e) => {
        const newImage = e[0]
        if (newImage) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const previewUrl = event.target.result
                setPreviewUrl(previewUrl)
            }

            reader.readAsDataURL(newImage)
            if (avatar !== null && avatar !== undefined) {
                handleAvatarChange(avatar, newImage)
            } else {
                console.error('Avatar is null or undefined. Unable to update image.')
            }
            setModalIsOpen(false)
        } else {
            console.log('failed')
        }
    }

// JSX

    return (
        <div id='edit_image_div'>
            <button className="submit_button" onClick={() => setModalIsOpen(true)}>Update Image</button>
            <Modal
                id='file_loader'
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Image Updater"
            >
                <input type="file" onChange={(e) => handlePatchRequest(e.target.files)} />
                {previewUrl && <img src={previewUrl} alt="Selected Preview" />}
                <button className="submit_button" onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>
    )
}

export default ImageChanger;