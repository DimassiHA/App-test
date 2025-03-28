import React, { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = request, 2 = verify
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/password-reset/request/', { email });
      setMessage(response.data.message);
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification code');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/password-reset/verify/', {
        email,
        token,
        new_password: newPassword
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="info-message">{message}</p>}

        {step === 1 ? (
          <form onSubmit={handleRequest}>
            <p>Enter your email to receive a verification code</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Verification Code</button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <p>Check your email for the verification code</p>
            <input
              type="text"
              placeholder="Verification Code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}

        <div className="forgot-password-footer">
          <button onClick={() => navigate('/admin')}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;