import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await api.post('/auth/login', formData);
            const { access_token } = response.data;

            // Fetch user profile to get role and other info
            const userResponse = await api.get('/admin/users', {
                headers: { Authorization: `Bearer ${access_token}` }
            }).catch(() => {
                // If admin/users fails, we just use a placeholder or assume 'user' role
                // For this demo, let's just decode the token or assume the user exists
                return { data: [{ email, role: 'user' }] }; // fallback
            });

            // Find the specific user from the list (simplified for demo)
            const loggedUser = userResponse.data.find(u => u.email === email) || { email, role: 'user' };

            login(loggedUser, access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card text-center">
                <img src="/owl-mascot.png" alt="Vaultflow Owl" className="auth-logo" />
                <h2>Welcome Back</h2>
                <p>Login to your Vaultflow account</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
