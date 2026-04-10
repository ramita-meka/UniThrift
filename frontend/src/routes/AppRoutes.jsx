import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// Import other pages later

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<div className="text-center py-20 text-2xl font-semibold text-gray-400">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
