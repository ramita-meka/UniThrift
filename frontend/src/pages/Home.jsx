import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import ImageCarousel from '../components/common/ImageCarousel';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Dynamic Theme based on User's University
  const getTheme = () => {
      if (!user) return { bg: 'bg-indigo-600', text: 'text-indigo-600', name: 'UniThrift', img: '' };
      if (user.role === 'Admin') return { bg: 'bg-gray-900', text: 'text-gray-900', name: 'Global Administrator Hub', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' };
      switch (user.university) {
          case 'SRMAP': return { bg: 'bg-blue-600', text: 'text-blue-600', name: 'SRM AP Marketplace', img: 'https://www.deccanchronicle.com/h-upload/2024/08/03/1828565-9.webp' };
          case 'VIT-AP': return { bg: 'bg-purple-600', text: 'text-purple-600', name: 'VIT-AP Marketplace', img: 'https://campuspro.co.in/collage-image/1749038379_row_70.jpg' };
          case 'KL University': return { bg: 'bg-green-600', text: 'text-green-600', name: 'KL University Marketplace', img: 'https://www.kluniversity.in/img/aboutus.jpg' };
          default: return { bg: 'bg-indigo-600', text: 'text-indigo-600', name: 'UniThrift', img: '' };
      }
  };

  const theme = getTheme();
  const navigate = useNavigate();
  const isStrictSeller = user && user.role === 'Seller';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = (user && user.role !== 'Admin') ? `/api/products?university=${user.university}` : '/api/products';
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching backend products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const addToCart = async (id) => {
      if(!user) return navigate('/login');
      try { await axios.post('/api/users/cart', { productId: id }); alert('Added to cart!'); } 
      catch (e) { alert('Failed to add to cart or already in cart'); }
  };
  
  const addToWishlist = async (id) => {
      if(!user) return navigate('/login');
      try { await axios.post('/api/users/wishlist', { productId: id }); alert('Added to wishlist!'); } 
      catch (e) { alert('Failed to add to wishlist or already in wishlist'); }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section 
        className={`relative ${theme.bg} rounded-2xl overflow-hidden shadow-xl transition-colors duration-500 bg-cover bg-center`}
        style={theme.img ? { backgroundImage: `url(${theme.img})` } : {}}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-8 py-20 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Buy & Sell Smart on Campus</h1>
          <p className="text-lg md:text-2xl mb-8 text-white max-w-2xl mx-auto opacity-90">
             {user ? `Welcome to the exclusive ${theme.name}. Your campus, your marketplace.` : 'The exclusive second-hand marketplace for students. Save money, reduce waste.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {(!user || user.role !== 'Seller') && (
                <button className={`btn-primary bg-white ${theme.text} hover:bg-gray-50 shadow-lg px-8 py-3 text-lg font-semibold w-full sm:w-auto`}>Shop Now</button>
            )}
            {(!user || user.role !== 'Buyer') && (
                <button className="btn-primary bg-black bg-opacity-30 hover:bg-opacity-40 border border-white border-opacity-20 shadow-lg px-8 py-3 text-lg font-semibold w-full sm:w-auto text-white">Sell an Item</button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Books', 'Electronics', 'Furniture', 'Accessories'].map((cat) => (
            <div key={cat} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-opacity-10 text-opacity-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform ${theme.text} ${theme.bg.replace('bg-', 'bg-opacity-10 bg-')}`}>
                <span className="text-xl sm:text-2xl">
                    {cat === 'Books' ? '📚' : cat === 'Electronics' ? '💻' : cat === 'Furniture' ? '🪑' : '🎒'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="px-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending {user && user.role !== 'Admin' ? `at ${user.university}` : 'Globally (Admin View)'}</h2>
        
        {loading ? (
            <div className="text-center text-gray-500 py-10">Loading items from backend...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {products.length > 0 ? products.map(product => (
                 <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col group relative">
                   <div className="bg-gray-100 h-48 w-full flex items-center justify-center text-gray-400 overflow-hidden relative">
                     <ImageCarousel imageUrls={product.imageUrls} altText={product.name} isSold={product.status === 'Sold'} />
                   </div>
                   {product.status !== 'Sold' && !isStrictSeller && (
                     <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <button onClick={() => addToWishlist(product._id)} title="Add to Wishlist" className="bg-white p-2 text-gray-500 hover:text-pink-500 rounded-full shadow-md flex items-center justify-center"><FiHeart/></button>
                         <button onClick={() => addToCart(product._id)} title="Add to Cart" className="bg-white p-2 text-gray-500 hover:text-indigo-600 rounded-full shadow-md flex items-center justify-center"><FiShoppingCart/></button>
                     </div>
                   )}
                   <div className="p-4 flex flex-col flex-grow">
                     <div className={`text-xs font-semibold ${theme.text} mb-1 uppercase tracking-wide`}>{product.category}</div>
                     <Link to={`/product/${product._id}`} className="font-semibold text-gray-900 mb-2 truncate hover:text-indigo-600 transition-colors">
                        {product.name}
                     </Link>
                     <p className="text-xs text-gray-500 mb-3 truncate">📍 {product.university}</p>
                     <div className="mt-auto flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{product.condition}</span>
                     </div>
                   </div>
                 </div>
               )) : (
                 <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-lg font-medium text-gray-700">No items available {user ? `at ${user.university}` : ''} currently.</p>
                    <p className="text-gray-500 mt-2">Check back later or be the first to sell!</p>
                 </div>
               )}
            </div>
        )}
      </section>
    </div>
  );
};

export default Home;
