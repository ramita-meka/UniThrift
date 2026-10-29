import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Sell from '../pages/Sell';
import Category from '../pages/Category';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Profile from '../pages/Profile';
import ProductDetail from '../pages/ProductDetail';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop/:categoryName" element={<Category />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="*" element={<div className="text-center py-20 text-2xl font-semibold text-gray-400">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
