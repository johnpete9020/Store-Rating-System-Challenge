import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [owners, setOwners] = useState([]); 
  
  // States for Listings & Filters
  const [usersList, setUsersList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register: registerStore, handleSubmit: handleSubmitStore, reset: resetStore } = useForm();
  const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser, formState: { errors: userErrors } } = useForm();

  // Fetch Core Data
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`);
      setStats(response.data);
    } catch (err) { setError('Failed to load dashboard statistics.'); }
  };

  const fetchOwners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users?role=store_owner`);
      setOwners(response.data);
    } catch (err) { console.error('Failed to load owners list.'); }
  };

  // Fetch Data Tables with Filters applied
  const fetchUsersList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, { params: userFilters });
      setUsersList(response.data);
    } catch (err) { console.error(err); }
  };

  const fetchStoresList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stores`, { params: storeFilters });
      setStoresList(response.data);
    } catch (err) { console.error(err); }
  };

  // Initial Load & Filter Triggers
  useEffect(() => {
    fetchStats();
    fetchOwners();
  }, []);

  useEffect(() => { fetchUsersList(); }, [userFilters]);
  useEffect(() => { fetchStoresList(); }, [storeFilters]);

  // Form Submissions
  const onAddStore = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/stores`, data);
      alert('Store added successfully!');
      resetStore();
      fetchStats();
      fetchStoresList();
    } catch (err) { alert(err.response?.data?.error || 'Failed to add store'); }
  };

  const onAddUser = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/users`, data);
      alert('User created successfully!');
      resetUser();
      fetchStats();
      fetchUsersList();
      if (data.role === 'store_owner') fetchOwners();
    } catch (err) { alert(err.response?.data?.error || 'Failed to create user'); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper for filter changes
  const handleUserFilterChange = (e) => setUserFilters({ ...userFilters, [e.target.name]: e.target.value });
  const handleStoreFilterChange = (e) => setStoreFilters({ ...storeFilters, [e.target.name]: e.target.value });

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Logged in as: {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#DC3545', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Platform Statistics */}
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', textAlign: 'center' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', textAlign: 'center' }}>
          <h3>Total Stores</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalStores}</p>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', textAlign: 'center' }}>
          <h3>Total Ratings</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalRatings}</p>
        </div>
      </div>

      {/* Forms Section */}
      <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd' }}>
          <h3>Add New Store</h3>
          <form onSubmit={handleSubmitStore(onAddStore)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Store Name" {...registerStore("name", { required: true })} style={{ padding: '8px' }} />
            <input placeholder="Email" type="email" {...registerStore("email", { required: true })} style={{ padding: '8px' }} />
            <input placeholder="Address" {...registerStore("address", { required: true })} style={{ padding: '8px' }} />
            <select defaultValue="" {...registerStore("owner_id", { required: true })} style={{ padding: '8px' }}>
              <option value="" disabled>-- Select Store Owner --</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
            <button type="submit" style={{ padding: '10px', background: '#28A745', color: 'white', border: 'none', cursor: 'pointer' }}>Add Store</button>
          </form>
        </div>

        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd' }}>
          <h3>Add New User</h3>
          <form onSubmit={handleSubmitUser(onAddUser)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Full Name (Min 20 chars)" {...registerUser("name", { required: true, minLength: 20, maxLength: 60 })} style={{ padding: '8px' }} />
            {userErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>Name must be 20-60 characters.</span>}
            <input placeholder="Email" type="email" {...registerUser("email", { required: true })} style={{ padding: '8px' }} />
            <input placeholder="Password (1 Upper, 1 Special, 8-16 chars)" type="password" {...registerUser("password", { required: true, pattern: /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,16}$/ })} style={{ padding: '8px' }} />
            {userErrors.password && <span style={{ color: 'red', fontSize: '12px' }}>Invalid password format.</span>}
            <input placeholder="Address" {...registerUser("address", { required: true, maxLength: 400 })} style={{ padding: '8px' }} />
            <select {...registerUser("role")} style={{ padding: '8px' }}>
              <option value="normal_user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="system_admin">System Admin</option>
            </select>
            <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Create User</button>
          </form>
        </div>
      </div>

      <hr style={{ margin: '40px 0', border: '1px solid #eee' }} />

      {/* Stores List Section */}
      <h3>Platform Stores List</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input type="text" name="name" placeholder="Filter by Name" value={storeFilters.name} onChange={handleStoreFilterChange} style={{ padding: '8px', flex: 1 }} />
        <input type="text" name="email" placeholder="Filter by Email" value={storeFilters.email} onChange={handleStoreFilterChange} style={{ padding: '8px', flex: 1 }} />
        <input type="text" name="address" placeholder="Filter by Address" value={storeFilters.address} onChange={handleStoreFilterChange} style={{ padding: '8px', flex: 1 }} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Owner Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {storesList.map(store => (
            <tr key={store.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.address}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{store.owner_name || 'No Owner'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>⭐ {store.average_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Users List Section */}
      <h3>Platform Users List</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input type="text" name="name" placeholder="Filter by Name" value={userFilters.name} onChange={handleUserFilterChange} style={{ padding: '8px', flex: 1 }} />
        <input type="text" name="email" placeholder="Filter by Email" value={userFilters.email} onChange={handleUserFilterChange} style={{ padding: '8px', flex: 1 }} />
        <input type="text" name="address" placeholder="Filter by Address" value={userFilters.address} onChange={handleUserFilterChange} style={{ padding: '8px', flex: 1 }} />
        <select name="role" value={userFilters.role} onChange={handleUserFilterChange} style={{ padding: '8px', flex: 1 }}>
          <option value="">All Roles</option>
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
          <option value="system_admin">System Admin</option>
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Store Rating (Owners Only)</th>
          </tr>
        </thead>
        <tbody>
          {usersList.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.address}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role.replace('_', ' ')}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {user.role === 'store_owner' ? (user.store_rating ? `⭐ ${user.store_rating}` : 'No ratings yet') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;