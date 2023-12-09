"use cient";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/CarModel.module.css';

function CarForm() {

    const [carModel, setCarModel] = useState('');
    const [price, setPrice] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [maxPictures, setMaxPictures] = useState(3);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const router = useRouter();
    const { name } = router.query


    const handlePictureUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedImages.length >= maxPictures) {
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
    };

    useEffect(() => {
        if (!name)
            router.push('/')
    }, [name])

    const handleAddCar = async () => {
        if (!carModel || !price || !phoneNumber) {
            alert('Please fill in all required fields.');
            return;
        }
        if (phoneNumber.length !== 11) {
            alert('Phone number must have 11 length');
            return;
        }
        if (maxPictures <= 0) {
            alert('Max pictures must not be 0');
            return;
        }

        const formData = new FormData();
        formData.append('carModel', carModel);
        formData.append('price', price);
        formData.append('phoneNumber', phoneNumber);
        formData.append('maxPictures', maxPictures);
        formData.append('gallery', selectedImages);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/car/add`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Car added successfully');
                resetForm();
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
            <h2>{name}</h2>
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
                        multiple
                    />
                    <div className={styles.imagePreviews}>
                        {imagePreviews.length > 0 && imagePreviews?.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`Image ${index}`}
                                className={styles.imagePreview}
                            />
                        ))}
                    </div>
                    <div>
                        <div onClick={() => {
                            if (imagePreviews.length > 0) {
                                const news = imagePreviews
                                news.pop()
                                setImagePreviews([...news]);
                            }
                        }}
                            className={styles.deleteButton}>Delete</div>
                    </div>
                </div>
                <button type="button" onClick={handleAddCar} className={styles.addButton}>
                    Add Car
                </button>
            </form>
        </div>
    );
}

export default CarForm;