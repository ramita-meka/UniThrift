import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ImageCarousel from '../components/common/ImageCarousel';
import { FiShoppingCart, FiHeart, FiArrowLeft } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
      if(!user) return navigate('/login');
      try { await axios.post('/api/users/cart', { productId: id }); alert('Added to cart!'); } 
      catch (e) { alert('Failed to add to cart or already in cart'); }
  };
  
  const addToWishlist = async () => {
      if(!user) return navigate('/login');
      try { await axios.post('/api/users/wishlist', { productId: id }); alert('Added to wishlist!'); } 
      catch (e) { alert('Failed to add to wishlist or already in wishlist'); }
  };
  
  const handlePurchaseRequest = async () => {
      if(!user) return navigate('/login');
      try {
          await axios.post('/api/orders/request', { productId: id });
          setRequestStatus('Sent');
          alert('Purchase request successfully sent to the seller!');
      } catch (e) {
          const msg = e.response?.data?.message || 'Failed to send request';
          if (msg.includes('already requested')) setRequestStatus('Sent');
          alert(msg);
      }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 min-h-screen">Loading product...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500 min-h-screen">{error || 'Product not found'}</div>;

  const isSold = product.status === 'Sold';
  const isOwner = user && user.UserID === product.UserID;
  const isStrictSeller = user && user.role === 'Seller';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition">
          <FiArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="w-full md:w-1/2 h-96 md:h-auto bg-gray-100 flex-shrink-0 relative overflow-hidden">
             <ImageCarousel imageUrls={product.imageUrls} altText={product.name} isSold={isSold} />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-widest">{product.category}</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">{product.condition}</span>
              </div>

              <div className="border-t border-b border-gray-100 py-6 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Item Description</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {product.description || "The seller hasn't provided a description for this item."}
                  </p>
              </div>

              <div className="flex flex-col space-y-3 mt-auto">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div><span className="block font-semibold text-gray-700">Seller</span>{product.seller}</div>
                      <div className="text-right"><span className="block font-semibold text-gray-700">Campus</span>{product.university}</div>
                  </div>

                  {!isSold && !isOwner && !isStrictSeller && (
                      <div className="flex flex-col space-y-3">
                          <button 
                              onClick={handlePurchaseRequest} 
                              disabled={requestStatus === 'Sent'}
                              className={`w-full py-4 font-bold rounded-xl transition flex items-center justify-center text-lg ${requestStatus === 'Sent' ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg'}`}
                          >
                              {requestStatus === 'Sent' ? 'Request Sent ✓' : 'Buy Now'}
                          </button>
                          <div className="flex space-x-3">
                              <button onClick={addToCart} className="flex-1 btn-primary py-3 flex items-center justify-center text-base shadow-sm">
                                  <FiShoppingCart className="mr-2" /> Add to Cart
                              </button>
                              <button onClick={addToWishlist} className="px-5 py-3 border border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl transition flex items-center justify-center shadow-sm" title="Save to Wishlist">
                                  <FiHeart className="text-lg" />
                              </button>
                          </div>
                      </div>
                  )}
                  
                  {isSold && (
                      <div className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-xl flex items-center justify-center text-lg border border-gray-200 cursor-not-allowed">
                          This item has been sold
                      </div>
                  )}
                  
                  {!isSold && isStrictSeller && !isOwner && (
                      <div className="w-full py-4 bg-yellow-50 text-yellow-700 font-bold rounded-xl flex items-center justify-center border border-yellow-200 text-sm">
                          Your account role strictly limits you to Selling
                      </div>
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default ProductDetail;
