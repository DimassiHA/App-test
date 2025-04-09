import React, { useState } from 'react';
import axios from "../../api";
import { useNavigate } from 'react-router-dom';
import "../Register.css";// You'll define styles here

const ClientRegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        region: '',
        birth_date: '',
        gender: '',
        profile_picture: null
    });

    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile_picture') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password confirmation
        if (formData.password !== formData.password_confirmation) {
            setMessage('Passwords do not match!');
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await axios.post('/register/client/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Registration successful!');
<<<<<<< HEAD
            navigate('/login');
=======
            console.log(response.data); // Log the response from the backend
            navigate('/login'); // Redirect to home after successful registration
>>>>>>> 40b57697b360fb3144ed53da7046ccd07eb78fd6
        } catch (error) {
            setMessage('Registration failed. Please try again.');
            console.error(error.response?.data);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-box">
                <h2>Create Account</h2>
                {message && <p className="info-message">{message}</p>}
                <form>
                    {currentStep === 1 && (
                        <div className="step">
                            <h3>Personal Details</h3>
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
                            <h3>Contact Details</h3>
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
                            />
                            <button type="button" onClick={prevStep}>Previous</button>
                            <button type="button" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step">
                            <h3>Additional Details</h3>
                            <input
                                type="file"
                                name="profile_picture"
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="region"
                                placeholder="Region"
                                value={formData.region}
                                onChange={handleChange}
                            />
                            <select
                                name="gender"
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <button type="button" onClick={prevStep}>Previous</button>
                            <button type="button" onClick={nextStep}>Next</button>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="step">
                            <h3>Password Details</h3>
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
                            <button type="submit" onClick={handleSubmit}>Submit</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ClientRegistrationForm;
