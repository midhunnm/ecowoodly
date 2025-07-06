import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/signup', form);
      const { message } = res.data;
      setMessage(message);

      if (message === 'Registration successful') {
        const loginRes = await axios.post('http://localhost:4000/login', {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem('userEmail', form.email); // Store user email
        login(loginRes.data.user); 
        navigate('/open');         
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="signup">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          value={form.username}
          onChange={handleChange}
        /><br /><br />

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

        <Button variant="outlined" type="submit">SIGNUP</Button><br />
        <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>
      </form>
    </div>
  );
};

export default Signup;
