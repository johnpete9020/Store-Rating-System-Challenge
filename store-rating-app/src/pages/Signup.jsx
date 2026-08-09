import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await axios.post('`${import.meta.env.VITE_API_URL}/auth/register', data);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Normal User Sign Up</h2>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Name</label><br/>
          <input 
            style={{ width: '100%', padding: '8px' }}
            {...register("name", { 
              required: "Name is required", 
              minLength: { value: 20, message: "Minimum 20 characters required" },
              maxLength: { value: 60, message: "Maximum 60 characters allowed" }
            })} 
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name.message}</span>}
        </div>

        <div>
          <label>Email</label><br/>
          <input 
            type="email" 
            style={{ width: '100%', padding: '8px' }}
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address format"
              }
            })} 
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
        </div>

        <div>
          <label>Password</label><br/>
          <input 
            type="password" 
            style={{ width: '100%', padding: '8px' }}
            {...register("password", { 
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,16}$/,
                message: "8-16 chars, at least 1 uppercase and 1 special character."
              }
            })} 
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}
        </div>

        <div>
          <label>Address</label><br/>
          <textarea 
            style={{ width: '100%', padding: '8px' }}
            {...register("address", { 
              required: "Address is required",
              maxLength: { value: 400, message: "Maximum 400 characters allowed" }
            })} 
          />
          {errors.address && <span style={{ color: 'red', fontSize: '12px' }}>{errors.address.message}</span>}
        </div>

        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none' }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div>
  );
};

export default Signup;