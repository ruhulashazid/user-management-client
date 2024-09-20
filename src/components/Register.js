import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'; // Reusing the same CSS file for consistent design

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // General email validation regex (allows all valid emails)
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.com$/;
        if (!emailRegex.test(email)) {
            setError('Please provide a valid email address.');
            setLoading(false);
            return;
        }

        // Validation for name: must start with a letter and can contain letters and digits
        const nameRegex = /^[A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9]$/;
        if (!nameRegex.test(name)) {
            setError('Name must start with a letter and can contain letters and digits only.');
            setLoading(false);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                password,
            });
            setLoading(false);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            setError('There was an error registering the user!');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                <p>Already have an account? <a href="/login">Login</a></p>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
