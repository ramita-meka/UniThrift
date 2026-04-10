import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching backend products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 px-8 py-20 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Buy & Sell Smart on Campus</h1>
          <p className="text-lg md:text-2xl mb-8 text-indigo-100 max-w-2xl mx-auto">The exclusive second-hand marketplace for UniThrift students. Save money, reduce waste.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="btn-primary bg-white text-indigo-600 hover:bg-gray-50 shadow-lg px-8 py-3 text-lg font-semibold w-full sm:w-auto">Shop Now</button>
            <button className="btn-primary bg-indigo-500 hover:bg-indigo-400 border border-indigo-400 shadow-lg px-8 py-3 text-lg font-semibold w-full sm:w-auto">Sell an Item</button>
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
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl">
                    {cat === 'Books' ? '📚' : cat === 'Electronics' ? '💻' : cat === 'Furniture' ? '🪑' : '🎒'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products Stub */}
      <section className="px-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending right now</h2>
        
        {loading ? (
            <div className="text-center text-gray-500 py-10">Loading items from backend...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {products.length > 0 ? products.map(product => (
                 <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                   <div className="bg-gray-200 h-48 w-full flex items-center justify-center text-gray-400">
                     [Image]
                   </div>
                   <div className="p-4 flex flex-col flex-grow">
                     <div className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">{product.category}</div>
                     <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
                     <div className="mt-auto flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{product.condition}</span>
                     </div>
                   </div>
                 </div>
               )) : (
                 <div className="col-span-full text-center text-gray-500">No products found.</div>
               )}
            </div>
        )}
      </section>
    </div>
  );
};

export default Home;
