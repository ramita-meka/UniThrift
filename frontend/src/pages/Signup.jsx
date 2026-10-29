import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', regNumber: '', email: '', phone: '', password: '', department: '', university: 'SRMAP', role: 'Buyer'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const universities = ['SRMAP', 'VIT-AP', 'KL University'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const apiMessage = err.response?.data?.message || 'Failed to register';
      const detailError = err.response?.data?.error ? ` (${err.response?.data?.error})` : '';
      setError(apiMessage + detailError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join your exclusive campus marketplace</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reg. Number</label>
              <input type="text" name="regNumber" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.regNumber} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">University Email</label>
              <input type="email" name="email" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" name="phone" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Department / Major</label>
             <input type="text" name="department" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.department} onChange={handleChange} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Select University</label>
            <select name="university" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={formData.university} onChange={handleChange}>
              {universities.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Intention</label>
            <select name="role" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={formData.role} onChange={handleChange}>
              <option value="Buyer">I want to Buy items</option>
              <option value="Seller">I want to Sell items</option>
              <option value="Both">I want to Buy and Sell items</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" disabled={isLoading} className={`w-full btn-primary py-3 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
