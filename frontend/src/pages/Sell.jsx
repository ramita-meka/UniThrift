import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Sell = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Books',
    itemCondition: 'New',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Secure Role check
  if (!user || user.role === 'Buyer') {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Access Denied 🛑</h2>
              <p className="text-gray-500 mb-6">You must upgrade to a Seller to list items on your campus marketplace.</p>
              <button onClick={() => navigate('/')} className="btn-primary py-2 px-6">Return Home</button>
          </div>
      );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('itemCondition', formData.itemCondition);
      data.append('description', formData.description);
      
      if (imageFiles && imageFiles.length > 0) {
          Array.from(imageFiles).forEach(file => {
              data.append('images', file);
          });
      }

      await axios.post('/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Item successfully listed on the marketplace!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Sell an Item</h2>
        <p className="text-gray-500 text-sm mb-6">Listing securely to the {user.university} campus marketplace.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center"><span>{error}</span></div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm flex items-center"><span>{success}</span></div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Title</label>
            <input type="text" name="title" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.title} onChange={handleChange} placeholder="e.g., Engineering Mathematics Textbook" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input type="number" step="0.01" min="0" name="price" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.price} onChange={handleChange} placeholder="₹ 0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={formData.category} onChange={handleChange}>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Condition</label>
             <select name="itemCondition" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={formData.itemCondition} onChange={handleChange}>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
              </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                <span className="text-xs text-gray-500 font-medium">Select up to 5</span>
            </div>
            <input type="file" multiple accept="image/*" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-lg" onChange={(e) => setImageFiles(e.target.files)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows="4" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={formData.description} onChange={handleChange} placeholder="Describe your item, its features, and any flaws..."></textarea>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Publishing your listing...' : 'List Item for Sale'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sell;
