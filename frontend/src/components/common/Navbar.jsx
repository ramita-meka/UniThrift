import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoriesList = ['Books', 'Electronics', 'Furniture', 'Accessories'];
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

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

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl px-8">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search for items..." />
            </div>
          </div>

          {/* Navigation Links & Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <nav className="hidden lg:flex space-x-6 items-center">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
              
              <div className="relative group" onMouseEnter={() => setIsCategoryOpen(true)} onMouseLeave={() => setIsCategoryOpen(false)}>
                <button className="text-gray-600 hover:text-indigo-600 font-medium transition-colors focus:outline-none py-2">
                  Categories
                </button>
                {isCategoryOpen && (
                  <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-2">
                    {categoriesList.map((cat) => (
                      <Link key={cat} to={`/shop/${cat}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {user && (user.role === 'Seller' || user.role === 'Both') && (
                  <Link to="/sell" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Sell Item</Link>
              )}
              {user && user.role === 'Admin' && (
                  <Link to="/admin" className="text-purple-600 font-black hover:text-purple-800 transition-colors uppercase tracking-widest text-sm">System Admin</Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              { user ? (
                  <>
                      {user.role !== 'Seller' && (
                          <>
                              <Link to="/cart" className="text-gray-400 hover:text-indigo-600 relative hidden sm:block" title="Cart">
                                <FiShoppingCart className="h-6 w-6" />
                              </Link>
                              <Link to="/wishlist" className="hidden sm:block text-gray-400 hover:text-pink-500" title="Wishlist">
                                <FiHeart className="h-6 w-6" />
                              </Link>
                          </>
                      )}
                      <Link to="/profile" className="hidden sm:block text-gray-400 hover:text-indigo-600" title={user.name}>
                        <FiUser className="h-6 w-6" />
                      </Link>
                      <button onClick={handleLogout} className="hidden sm:block text-gray-400 hover:text-red-500" title="Logout">
                        <FiLogOut className="h-6 w-6" />
                      </button>
                  </>
              ) : (
                  <div className="hidden sm:flex items-center space-x-4">
                      <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Log In</Link>
                      <Link to="/signup" className="btn-primary py-1.5 px-4 text-sm">Sign Up</Link>
                  </div>
              )}
              
              <button className="lg:hidden text-gray-600 hover:text-indigo-600 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu logic... omitted inline for brevity */}
        
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
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md py-4 px-4 flex flex-col space-y-4 z-50">
            <Link to="/" className="text-gray-800 font-medium hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            
            <div className="flex flex-col space-y-2">
              <span className="text-gray-800 font-medium">Categories</span>
              <div className="pl-4 border-l-2 border-indigo-100 flex flex-col space-y-2">
                {categoriesList.map(cat => (
                  <Link key={cat} to={`/shop/${cat}`} className="text-gray-600 hover:text-indigo-600 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            {user && (user.role === 'Seller' || user.role === 'Both') && (
                <Link to="/sell" className="text-gray-800 font-medium hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Sell Item</Link>
            )}
            {user && user.role === 'Admin' && (
                <Link to="/admin" className="text-purple-700 font-black hover:text-purple-900" onClick={() => setIsMobileMenuOpen(false)}>SYSTEM ADMIN</Link>
            )}
            <div className="border-t border-gray-100 pt-4 flex space-x-6">
              <Link to="/profile" className="flex items-center text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                <FiUser className="h-5 w-5 mr-2" /> Profile
              </Link>
              {user && user.role !== 'Seller' && (
                  <Link to="/wishlist" className="flex items-center text-gray-600 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiHeart className="h-5 w-5 mr-2" /> Wishlist
                  </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
