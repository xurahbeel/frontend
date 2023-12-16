import React from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import { LoginSchema } from './Schema';
import bcrypt from 'bcryptjs';

export default function Login() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                const hashPassword = await bcrypt.hash(values.password, 10)
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/sign-in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...values, password: hashPassword }),
                }).then((response) => {
                    if (response.status === 401) {
                        alert('Login failed: Email or password is incorrect');
                        return;
                    }
                    if (response.status === 200) {
                        alert('Login successful');
                    }
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        alert('Login failed: An unexpected error occurred');
                        return;
                    }
                }).then((data) => {
                    console.log("data : ", data)
                    if (data)
                        router.push({
                            pathname: '/carmodel',
                            query: { name: values.email },
                        });
                });
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
    });

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h2>Login</h2>
                <div className={styles.formGroup}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className={styles.error}>{formik.errors.email}</p>
                    )}
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className={styles.error}>{formik.errors.password}</p>
                    )}
                </div>
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
        </div>
    );
}
