import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components (we will build these next)
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreList from './pages/StoreList';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

const Unauthorized = () => <h2>403 - Unauthorized</h2>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          {/* Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Store Owner */}
          <Route 
            path="/owner" 
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Normal User */}
          <Route 
            path="/stores" 
            element={
              <ProtectedRoute allowedRoles={['normal_user']}>
                <StoreList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;