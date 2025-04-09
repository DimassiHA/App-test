import React, { useState } from 'react';
import axios from "../../api";
import { useNavigate } from 'react-router-dom';
import "../Register.css"; // You can reuse the same styling

const ServiceOwnerRegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        birth_date: '',
        email: '',
        phone_number: '',
        region: '',
        profile_picture: null,
        business_name: '',
        description: '',
        service_pictures: [],
        password: '',
        password_confirmation: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'profile_picture') {
            setFormData({ ...formData, [name]: files[0] });
        } else if (name === 'service_pictures') {
            setFormData({ ...formData, [name]: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            setMessage('Passwords do not match!');
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            if (key === "service_pictures") {
                for (let i = 0; i < formData.service_pictures.length; i++) {
                    data.append('service_pictures', formData.service_pictures[i]);
                }
            } else {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('/register/service-owner/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Registration successful!');

            console.log("Response from backend:", response.data);
            navigate('/login');
        } catch (error) {
            setMessage('Registration failed. Please try again.');
            console.error(error.response?.data);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-box">
                <h2>Service Owner Registration</h2>
                {message && <p className="info-message">{message}</p>}
                <form>
                    {currentStep === 1 && (
                        <div className="step">
                            <h3>Personal Information</h3>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step">
                            <h3>Contact Information</h3>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={prevStep}>Previous</button>
                            <button type="button" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step">
                            <h3>Additional Information</h3>
                            <input
                                type="text"
                                name="region"
                                placeholder="Region"
                                value={formData.region}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="file"
                                name="profile_picture"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <button type="button" onClick={prevStep}>Previous</button>
                            <button type="button" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="step">
                            <h3>Business Information</h3>
                            <input
                                type="text"
                                name="business_name"
                                placeholder="Business Name"
                                value={formData.business_name}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Business Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="file"
                                name="service_pictures"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                            />
                            <button type="button" onClick={prevStep}>Previous</button>
                            <button type="button" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="step">
                            <h3>Password Setup</h3>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm Password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={prevStep}>Previous</button>
                            <button type="submit" onClick={handleSubmit}>Register</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ServiceOwnerRegistrationForm;
