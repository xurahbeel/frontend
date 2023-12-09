"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const formData = { email, password };


        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                alert('Login successful');
                router.push({
                    pathname: '/carmodel',
                    query: { name: email } // Your prop and its value
                });
            } else if (response.status === 401) {
                alert('Login failed: Email or password is incorrect');
            } else {
                alert('Login failed: An unexpected error occurred');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className={styles.formGroup}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    {errors.password && <p className={styles.error}>{errors.password}</p>}
                </div>
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
        </div>
    );
}