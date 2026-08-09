import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UpdatePassword from '../components/UpdatePassword';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch stores whenever search, sort, or order changes
  const fetchStores = async () => {
    try {
      setError('');
      const response = await axios.get(`http://localhost:5000/api/stores`, {
        params: { search, sortBy, order }
      });
      setStores(response.data);
    } catch (err) {
      setError('Failed to fetch stores');
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, order]);

  // Handle Rating Submission / Modification
  const handleRate = async (storeId, ratingValue) => {
    try {
      await axios.post(`http://localhost:5000/api/stores/${storeId}/rate`, {
        rating: parseInt(ratingValue)
      });
      alert('Rating submitted successfully!');
      fetchStores(); // Refresh store list to update average ratings
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Store Directory</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#DC3545', color: 'white', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search & Sort Controls */}
      <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="Search by store name or address..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px' }}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="address">Sort by Address</option>
          <option value="average_rating">Sort by Rating</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)} style={{ padding: '8px' }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Stores Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Store Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Overall Rating</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Submit / Modify Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No stores found.</td>
            </tr>
          ) : (
            stores.map((store) => (
              <tr key={store.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.address}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>⭐ {store.average_rating} / 5</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <select 
                    onChange={(e) => handleRate(store.id, e.target.value)}
                    defaultValue=""
                    style={{ padding: '5px' }}
                  >
                    <option value="" disabled>Rate (1-5)</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <UpdatePassword />
    </div>
  );
};

export default StoreList;