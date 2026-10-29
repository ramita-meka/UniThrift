import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import ImageCarousel from '../components/common/ImageCarousel';

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isStrictSeller = user && user.role === 'Seller';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = (user && user.role !== 'Admin') ? `/api/products?university=${user.university}&category=${categoryName}` : `/api/products?category=${categoryName}`;
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching category products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, categoryName]);

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
    <div className="space-y-8 py-8 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Category: {categoryName}</h1>
      
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading items...</div>
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
                 <div className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">{product.category}</div>
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
                <p className="text-lg font-medium text-gray-700">No items found in {categoryName}.</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Category;
