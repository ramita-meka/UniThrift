import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if(!user) return navigate('/login');
    try {
      const { data } = await axios.get('/api/users/cart');
      setItems(data);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleRemove = async (productId) => {
      try {
          await axios.delete(`/api/users/cart/${productId}`);
          fetchCart();
      } catch (err) {
          alert('Failed to remove item');
      }
  };
  
  const handleCheckout = async () => {
      if(!user) return navigate('/login');
      if(items.length === 0) return;
      
      try {
          // Send request for every item in cart
          await Promise.all(items.map(item => 
              axios.post('/api/orders/request', { productId: item.ProductID || item._id })
          ));
          alert('Checkout successful! Purchase requests have been sent to the sellers for all items.');
          
          // Optionally clear from cart
          for(let item of items) {
              await axios.delete(`/api/users/cart/${item.ProductID || item._id}`);
          }
          fetchCart();
      } catch (err) {
          const msg = err.response?.data?.message || 'Some requests failed to send. Items may be already requested or sold.';
          alert(msg);
          // Refresh cart to show accurate state
          fetchCart();
      }
  };

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Your Cart</h1>
      
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-lg">Your cart is perfectly empty.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
                {items.map(item => (
                    <div key={item._id} className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                                {item.imageUrls && item.imageUrls.length > 0 ? (
                                    <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-cover" />
                                ) : 'No Img'}
                            </div>
                            <Link to={`/product/${item.ProductID || item._id}`}>
                                <h4 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{item.name}</h4>
                            </Link>
                            <p className="text-sm text-gray-500">{item.category} • {item.condition}</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                            <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg">
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="w-full md:w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between text-gray-600 mb-2"><span>Subtotal ({items.length} items)</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600 mb-4 pb-4 border-b"><span>Tax Escrow</span><span>₹0.00</span></div>
                <div className="flex justify-between font-bold text-xl text-gray-900 mb-6"><span>Total</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center">
                    Proceed to Checkout
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
