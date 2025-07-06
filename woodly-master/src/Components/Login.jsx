import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/login', form);
      const { message, user } = res.data;
      setMessage(message);

      if (message === 'Login successful') {
        localStorage.setItem('userEmail', form.email); // For cart usage
        login(user);

        // ✅ Redirect based on role
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/open');
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
        /><br /><br />

        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={form.password}
          onChange={handleChange}
        /><br /><br />

        <Button variant="contained" type="submit">Login</Button><br />
        <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </p>
      </form>
    </div>
  );
};

export default Login;
