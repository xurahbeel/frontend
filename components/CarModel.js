"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import styles from '../styles/CarModel.module.css';
import { CarSchema } from './Schema';

function CarForm() {
    const router = useRouter();
    const { name } = router.query;

    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const formik = useFormik({
        initialValues: {
            carModel: '',
            price: '',
            phoneNumber: '',
            maxPictures: 3,
        },
        validationSchema: CarSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('carModel', values.carModel);
            formData.append('price', values.price);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('maxPictures', values.maxPictures);
            formData.append('gallery', selectedImages);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/car/add`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Car added successfully');
                    formik.resetForm();
                    setSelectedImages([]);
                    setImagePreviews([])
                } else {
                    alert('Failed to add car');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
    });

    const deletePicture = (index) => {
        const news = imagePreviews.filter((val, ind) => ind !== index)
        setSelectedImages([...news]);
        setImagePreviews([...news]);
    }

    const handlePictureUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedImages.length + selectedFiles.length > formik.values.maxPictures) {
            alert(`You can upload a maximum of ${formik.values.maxPictures} images.`);
            return;
        }

        setSelectedImages([...selectedImages, ...selectedFiles]);

        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    return (
        <div className={styles.container}>
            <h2>{name}</h2>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="carModel">Car Model:</label>
                    <input
                        type="text"
                        id="carModel"
                        name="carModel"
                        value={formik.values.carModel}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.carModel && formik.errors.carModel && (
                        <p className={styles.error}>{formik.errors.carModel}</p>
                    )}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.price && formik.errors.price && (
                        <p className={styles.error}>{formik.errors.price}</p>
                    )}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <p className={styles.error}>{formik.errors.phoneNumber}</p>
                    )}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="maxPictures">Max Pictures:</label>
                    <input
                        type="number"
                        id="maxPictures"
                        name="maxPictures"
                        value={formik.values.maxPictures}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={1}
                        max={10}
                        required
                    />
                    {formik.touched.maxPictures && formik.errors.maxPictures && (
                        <p className={styles.error}>{formik.errors.maxPictures}</p>
                    )}
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
                        {imagePreviews.length > 0 &&
                            imagePreviews?.map((preview, index) => (
                                <div style={{ display: "flex", gap: "30px", marginLeft: "60px" }} key={index}>
                                    <img
                                        src={preview}
                                        alt={`Image ${index}`}
                                        className={styles.imagePreview}
                                    />
                                    <div
                                        onClick={() => deletePicture(index)}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div>

                    </div>
                </div>
                <button type="submit" className={styles.addButton}>
                    Add Car
                </button>
            </form>
        </div>
    );
}

export default CarForm;
