import React, { useState } from 'react';
import axios from "../../api";
import { useNavigate } from 'react-router-dom';

const ServiceOwnerRegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        region: '',
        birth_date: '',
        profile_picture: null,
        business_name: '',
        description: '',
        service_pictures: []
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_picture') {
            setFormData({ ...formData, [name]: files[0] });
        } else if (name === 'service_pictures') {
            setFormData({ ...formData, [name]: Array.from(files) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation: Ensure at least one service picture is selected
        if (formData.service_pictures.length === 0) {
            setMessage('Please upload at least one service picture.');
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            if (key === 'service_pictures') {
                formData[key].forEach((file) => {
                    data.append(`service_pictures`, file);
                });
            } else {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('/register/service-owner/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Registration successful!');
            console.log("Response from backend:", response.data);
            navigate('/login');
        } catch (error) {
            setMessage('Registration failed. Please try again.');
            console.error("Error response:", error.response.data);
        }
    };

    return (
        <div>
            <h1>Service Owner Registration</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="number" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
                <input type="text" name="region" placeholder="Region" onChange={handleChange} />
                <input type="date" name="birth_date" placeholder="Birth Date" onChange={handleChange} />
                <input type="file" name="profile_picture" onChange={handleChange} />
                <input type="text" name="business_name" placeholder="Business Name" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" onChange={handleChange} required />
                <input type="file" name="service_pictures" multiple accept="image/*" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ServiceOwnerRegistrationForm;