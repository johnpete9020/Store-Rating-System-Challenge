import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UpdatePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setMessage('');
      setError('');
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/update-password`, { 
        newPassword: data.newPassword 
      });
      setMessage(response.data.message);
      reset();
      
      // Auto-close the modal after 2 seconds on success
      setTimeout(() => {
        closeModal();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage('');
    setError('');
    reset();
  };

  return (
    <>
      {/* Button to trigger the modal */}
      <div style={{ marginTop: '30px', paddingBottom: '20px' }}>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Change Password
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          zIndex: 1000 
        }}>
          
          {/* Modal Content Box */}
          <div style={{ 
            background: 'white', padding: '30px', borderRadius: '8px', 
            width: '100%', maxWidth: '400px', position: 'relative',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            
            {/* Close (X) Button */}
            <button 
              onClick={closeModal}
              style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#555' }}
            >
              &times;
            </button>

            <h3 style={{ margin: '0 0 20px 0' }}>Update Password</h3>
            
            {message && <p style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <input 
                  type="password" 
                  placeholder="Enter New Password" 
                  {...register("newPassword", { 
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,16}$/,
                      message: "Must be 8-16 chars, include 1 uppercase and 1 special character."
                    }
                  })} 
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {errors.newPassword && (
                  <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                    {errors.newPassword.message}
                  </span>
                )}
              </div>
              <button 
                type="submit" 
                style={{ padding: '12px', background: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Save New Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePassword;