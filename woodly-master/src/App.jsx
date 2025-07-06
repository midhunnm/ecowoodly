import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Nav from './Components/Nav';
import Cart from './Components/Cart';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Open from './Components/Open';
import AdminDashboard from './Components/AdminDashboard'; // ✅ Make sure this path is correct

import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './Components/CartContext';

import './App.css';

// ✅ Route Guard for Normal Users Only
const UserRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.isAdmin) return <Navigate to="/admin" />;
  return children;
};

// ✅ Route Guard for Admin Only
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/open" />;
  return children;
};

const AppContent = () => {
  return (
    <div className="app-background">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/open"
          element={
            <UserRoute>
              <Open />
            </UserRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
