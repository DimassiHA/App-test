import React, { useState } from 'react';
import axios from "../../api";
import { useNavigate } from 'react-router-dom';

const ClientRegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        region: '',
        birth_date: '',
        gender: '',
        profile_picture: null
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_picture') {
            setFormData({ ...formData, [name]: files[0] }); // Capture the file object
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        for (const key in formData) {
            if (key === 'profile_picture' && formData[key]) {
                data.append(key, formData[key]); // Append the file object
            } 
            else {
                data.append(key, formData[key]);
            }
        }
    
        try {
            const response = await axios.post('/register/client/', data ,{
            
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            setMessage('Registration successful!');
            console.log(response.data); // Log the response from the backend
            navigate('/login'); // Redirect to home after successful registration
        } catch (error) {
            setMessage('Registration failed. Please try again.');
            console.error(error.response.data); // Log the error response
        }
    };

    return (
        <div>
            <h1>Client Registration</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="number" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
                <input type="text" name="region" placeholder="Region" onChange={handleChange} />
                <input type="date" name="birth_date" placeholder="Birth Date" onChange={handleChange} />
                <select name="gender" onChange={handleChange} required>
                    
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="file" name="profile_picture" onChange={handleChange} />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ClientRegistrationForm;



