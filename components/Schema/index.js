import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export const CarSchema = Yup.object().shape({
    carModel: Yup.string().min(3, 'Car model must be at least 3 characters').required('Car model is required'),
    price: Yup.number().required('Price is required'),
    phoneNumber: Yup.string().length(11, 'Phone number must have 11 characters').required('Phone number is required'),
    maxPictures: Yup.number().min(1, 'Max pictures must be at least 1').max(10, 'Max pictures cannot exceed 10').required('Max pictures is required'),
});