import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await axios.post('`${import.meta.env.VITE_API_URL}/auth/login', data);
      
      const { token, user } = response.data;
      
      // Update global auth state
      login(token, user);

      // Redirect based on role
      if (user.role === 'system_admin') {
        navigate('/admin');
      } else if (user.role === 'store_owner') {
        navigate('/owner');
      } else {
        navigate('/stores');
      }
      
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Login</h2>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email</label><br/>
          <input 
            type="email" 
            style={{ width: '100%', padding: '8px' }}
            {...register("email", { required: "Email is required" })} 
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
        </div>

        <div>
          <label>Password</label><br/>
          <input 
            type="password" 
            style={{ width: '100%', padding: '8px' }}
            {...register("password", { required: "Password is required" })} 
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}
        </div>

        <button type="submit" style={{ padding: '10px', background: '#28A745', color: 'white', border: 'none' }}>
          Log In
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;