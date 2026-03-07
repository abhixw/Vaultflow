import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchUsers();
        } else {
            setLoading(false);
            setError('Access Denied: Admin role required.');
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            if (err.response?.status === 403) {
                setError('403 Forbidden: You do not have admin permissions.');
            } else {
                setError('Failed to fetch user list.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-info">
                    <h1>Admin Management</h1>
                    <p>System User Directory</p>
                </div>
                <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
            </header>

            <div className="admin-content">
                {loading ? (
                    <div className="loading">Checking permissions...</div>
                ) : error ? (
                    <div className="admin-error-card">
                        <span className="error-icon">🔒</span>
                        <h2>{error}</h2>
                        <p>Your current role is logged as "{user?.role}". Only accounts with the "admin" role can view this secure directory.</p>
                    </div>
                ) : (
                    <div className="user-list-card">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className={u.email === user?.email ? 'current-row' : ''}>
                                        <td>{u.id}</td>
                                        <td>{u.email}</td>
                                        <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                        <td>{u.is_active ? '✅ Active' : '❌ Inactive'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
