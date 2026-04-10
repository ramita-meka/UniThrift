import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tighter">
              Uni<span className="text-gray-900">Thrift</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:flex flex-1 max-w-2xl px-8">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" 
                placeholder="Search for books, furniture, electronics..." 
              />
            </div>
          </div>

          {/* Navigation Links & Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <nav className="hidden lg:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Categories</Link>
              <Link to="/sell" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Sell Item</Link>
            </nav>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link to="/wishlist" className="hidden sm:block text-gray-400 hover:text-red-500 transition-colors relative">
                <FiHeart className="h-6 w-6" />
              </Link>
              <Link to="/cart" className="text-gray-400 hover:text-indigo-600 transition-colors relative">
                <FiShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">2</span>
              </Link>
              <Link to="/profile" className="hidden sm:block text-gray-400 hover:text-gray-900 transition-colors">
                <FiUser className="h-6 w-6" />
              </Link>
              
              {/* Hamburger Button */}
              <button 
                className="lg:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
           <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Search items..." 
              />
            </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md py-4 px-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-800 font-medium hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-gray-800 font-medium hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            <Link to="/sell" className="text-gray-800 font-medium hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Sell Item</Link>
            <div className="border-t border-gray-100 pt-4 flex space-x-6">
              <Link to="/profile" className="flex items-center text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                <FiUser className="h-5 w-5 mr-2" /> Profile
              </Link>
              <Link to="/wishlist" className="flex items-center text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                <FiHeart className="h-5 w-5 mr-2" /> Wishlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
