"use Client"
// components/CarForm.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/CarModel.module.css';

export default function CarForm() {
    const [carModel, setCarModel] = useState('');
    const [price, setPrice] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [maxPictures, setMaxPictures] = useState(3);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [success, setSuccess] = useState(false);


    const handlePictureUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > maxPictures) {
            alert(`You can upload a maximum of ${maxPictures} images.`);
            return;
        }

        setSelectedImages([...selectedImages, ...selectedFiles]);

        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };
    const handleCarModelChange = (e) => {
        setCarModel(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleMaxPicturesChange = (e) => {
        setMaxPictures(e.target.value);
    };

    const resetForm = () => {
        setCarModel('');
        setPrice('');
        setPhoneNumber('');
        setMaxPictures(3);
        setSelectedImages([]);
        setImagePreviews([]);
        setSuccess(false);
    };


    const handleAddCar = async () => {
        if (!carModel || !price || !phoneNumber) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('carModel', carModel);
        formData.append('price', price);
        formData.append('phoneNumber', phoneNumber);
        formData.append('maxPictures', maxPictures);
        formData.append('gallery', selectedImages);
        try {
            const response = await fetch('http://192.168.100.145:8080/v1/car/add', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Car added successfully');
                setSuccess(true);
                // resetForm();
            } else {
                alert('Failed to add car');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };


    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    return (
        <div className={styles.container}>
            <h2>Add a Car</h2>
            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="carModel">Car Model:</label>
                    <input
                        type="text"
                        id="carModel"
                        value={carModel}
                        onChange={handleCarModelChange}
                        minLength={3}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        minLength={11}
                        maxLength={11}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="maxPictures">Max Pictures:</label>
                    <input
                        type="number"
                        id="maxPictures"
                        value={maxPictures}
                        onChange={handleMaxPicturesChange}
                        min={1}
                        max={10}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="pictureUpload">Picture Upload:</label>
                    <input
                        type="file"
                        id="pictureUpload"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        multiple // Allow multiple file selection
                    />
                    {/* Display image previews */}
                    <div className={styles.imagePreviews}>
                        {imagePreviews.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`Image ${index}`}
                                className={styles.imagePreview}
                            />
                        ))}
                    </div>
                </div>
                <button type="button" onClick={handleAddCar} className={styles.addButton}>
                    Add Car
                </button>
            </form>
        </div>
    );
}