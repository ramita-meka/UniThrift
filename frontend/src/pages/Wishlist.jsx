import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    if(!user) return navigate('/login');
    try {
      const { data } = await axios.get('/api/users/wishlist');
      setItems(data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
      try {
          await axios.delete(`/api/users/wishlist/${productId}`);
          fetchWishlist();
      } catch (err) {
          alert('Failed to remove item');
      }
  };
  
  const moveToCart = async (productId) => {
      try {
          await axios.post('/api/users/cart', { productId });
          await handleRemove(productId);
          alert('Moved to cart!');
      } catch(err) {
          alert('Failed to move to cart');
      }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Your Wishlist</h1>
      
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-lg">Your wishlist is perfectly empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
                <div key={item._id} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-col space-y-4">
                    <div className="flex items-start space-x-4">
                        <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                            {item.imageUrls && item.imageUrls.length > 0 ? (
                                <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-cover" />
                            ) : 'No Img'}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.category} • {item.condition}</p>
                            <span className="font-bold text-gray-900 mt-1 block">₹{item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex space-x-2 pt-2 border-t border-gray-50">
                        <button onClick={() => moveToCart(item._id)} className="flex-1 flex justify-center items-center py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition">
                            <FiShoppingCart className="mr-2"/> Move to Cart
                        </button>
                        <button onClick={() => handleRemove(item._id)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Remove">
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
