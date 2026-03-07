import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [editingTodo, setEditingTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await api.get('/todos/');
            setTodos(response.data);
        } catch (err) {
            setError('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/todos/', newTodo);
            setTodos([...todos, response.data]);
            setNewTodo({ title: '', description: '' });
        } catch (err) {
            setError('Failed to create task.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/todos/${editingTodo.id}`, {
                title: editingTodo.title,
                description: editingTodo.description,
                completed: editingTodo.completed
            });
            setTodos(todos.map(t => t.id === editingTodo.id ? response.data : t));
            setEditingTodo(null);
        } catch (err) {
            setError('Failed to update task.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            setError('Failed to delete task.');
        }
    };

    const toggleComplete = async (todo) => {
        try {
            const response = await api.put(`/todos/${todo.id}`, {
                ...todo,
                completed: !todo.completed
            });
            setTodos(todos.map(t => t.id === todo.id ? response.data : t));
        } catch (err) {
            setError('Failed to toggle completion.');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-info">
                    <h1>My Tasks</h1>
                    <p>Welcome, <span className="highlight">{user?.email}</span> ({user?.role})</p>
                </div>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <div className="dashboard-content">
                <section className="todo-form-section">
                    <h3>{editingTodo ? 'Edit Task' : 'Create New Task'}</h3>
                    <form onSubmit={editingTodo ? handleUpdate : handleCreate} className="todo-form">
                        <input
                            type="text"
                            placeholder="Task title..."
                            value={editingTodo ? editingTodo.title : newTodo.title}
                            onChange={(e) => editingTodo
                                ? setEditingTodo({ ...editingTodo, title: e.target.value })
                                : setNewTodo({ ...newTodo, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Description (optional)..."
                            value={editingTodo ? editingTodo.description : newTodo.description}
                            onChange={(e) => editingTodo
                                ? setEditingTodo({ ...editingTodo, description: e.target.value })
                                : setNewTodo({ ...newTodo, description: e.target.value })}
                        />
                        <div className="form-actions">
                            {editingTodo && (
                                <button type="button" className="cancel-btn" onClick={() => setEditingTodo(null)}>
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="primary-btn">
                                {editingTodo ? 'Save Changes' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="todo-list-section">
                    <h3>Active Tasks</h3>
                    {loading ? (
                        <div className="loading">Loading tasks...</div>
                    ) : todos.length === 0 ? (
                        <div className="empty-state">No tasks yet. Start by creating one!</div>
                    ) : (
                        <div className="todo-grid">
                            {todos.map(todo => (
                                <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                                    <div className="todo-header">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo)}
                                        />
                                        <h4>{todo.title}</h4>
                                    </div>
                                    <p>{todo.description || 'No description provided.'}</p>
                                    <div className="todo-footer">
                                        <button className="edit-btn" onClick={() => setEditingTodo(todo)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(todo.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
