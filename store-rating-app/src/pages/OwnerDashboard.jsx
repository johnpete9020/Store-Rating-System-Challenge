import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UpdatePassword from '../components/UpdatePassword';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/owner/dashboard`);
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard.');
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Store Owner Dashboard</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#DC3545', color: 'white', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Show error if owner has no store assigned yet */}
      {error && (
        <div style={{ background: '#f8d7da', padding: '15px', color: '#721c24', marginTop: '20px', border: '1px solid #f5c6cb' }}>
          <p><strong>Notice:</strong> {error}</p>
          <p style={{ fontSize: '14px', marginTop: '5px' }}>A System Admin needs to assign a store to your account.</p>
        </div>
      )}

      {dashboardData && (
        <>
          {/* Store Summary Card */}
          <div style={{ background: '#f8f9fa', padding: '20px', border: '1px solid #ddd', marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{dashboardData.storeDetails.name}</h3>
            <p style={{ margin: '5px 0' }}><strong>Address:</strong> {dashboardData.storeDetails.address}</p>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {dashboardData.storeDetails.email}</p>
            <div style={{ marginTop: '15px', fontSize: '20px', color: '#28A745' }}>
              <strong>Average Rating:</strong> ⭐ {dashboardData.averageRating} / 5
            </div>
          </div>

          {/* Detailed Ratings Table */}
          <h3 style={{ marginTop: '30px' }}>Customer Ratings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>User Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Rating</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.submittedRatings.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No ratings yet.</td>
                </tr>
              ) : (
                dashboardData.submittedRatings.map((rating, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{rating.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{rating.email}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>⭐ {rating.rating}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {new Date(rating.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
      <UpdatePassword />
    </div>
  );
};

export default OwnerDashboard;