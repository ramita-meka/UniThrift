import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/common/ImageCarousel';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchData = async () => {
        if(!user) return navigate('/login');
        try {
            const [profileRes, requestsRes, outgoingRes] = await Promise.all([
                axios.get('/api/users/profile'),
                user.role !== 'Buyer' ? axios.get('/api/orders/incoming') : Promise.resolve({ data: [] }),
                user.role !== 'Seller' ? axios.get('/api/orders/outgoing') : Promise.resolve({ data: [] })
            ]);
            setProfileData(profileRes.data);
            setIncomingRequests(requestsRes.data);
            setOutgoingRequests(outgoingRes.data);
        } catch (error) {
            console.error("Error fetching profile data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleAccept = async (orderId) => {
        try {
            await axios.put(`/api/orders/${orderId}/accept`);
            alert('Order formally accepted! Product has been marked as sold.');
            fetchData();
        } catch(e) {
            alert(e.response?.data?.message || 'Failed to accept order');
        }
    };

    const handleReject = async (orderId) => {
        if(!window.confirm('Are you sure you want to reject this offer?')) return;
        try {
            await axios.put(`/api/orders/${orderId}/reject`);
            fetchData();
        } catch(e) {
            alert(e.response?.data?.message || 'Failed to reject order');
        }
    };

    if(loading) return <div className="text-center py-20 text-gray-500 min-h-screen">Loading profile...</div>;
    if(!profileData) return <div className="text-center py-20 text-red-500 min-h-screen">Failed to load profile.</div>;

    const { profile, listings } = profileData;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex items-center space-x-6">
                    <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-4xl font-bold uppercase shadow-inner">
                        {profile.Name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.Name}</h1>
                        <p className="text-gray-500 mt-1">{profile.Email} • {profile.Phone}</p>
                        <div className="mt-3 flex space-x-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider">{profile.University}</span>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">{profile.Role}</span>
                        </div>
                    </div>
                </div>
            </div>

            {user.role !== 'Seller' && (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 mt-4">Your Purchase History</h2>
                    {outgoingRequests.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">You haven't purchased or requested any items yet.</div>
                    ) : (
                        <div className="space-y-4 mb-10">
                            {outgoingRequests.map(req => (
                                <div key={req.OrderID} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {req.ImageUrls && req.ImageUrls.length > 0 ? (
                                                <img src={req.ImageUrls[0]} alt={req.Title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{req.Title}</h4>
                                            <p className="text-sm text-gray-500">Seller: <span className="font-medium text-gray-700">{req.SellerName}</span> • 📍 {req.SellerUniversity}</p>
                                            <p className="text-xs text-gray-400 mt-1">Requested on {new Date(req.OrderDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end space-y-2">
                                        <div className="text-xl font-bold text-gray-900">₹{Number(req.Price).toFixed(2)}</div>
                                        {req.OrderStatus === 'Pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wide">Pending Request</span>}
                                        {req.OrderStatus === 'Completed' && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide">Purchased ✓</span>}
                                        {req.OrderStatus === 'Cancelled' && <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wide">Rejected / Lost</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 border-b pb-2">Your Listings</h2>
            {listings.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-lg">You haven't listed any items yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {listings.map(item => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                             <div className="bg-gray-100 h-48 w-full flex items-center justify-center text-gray-400 overflow-hidden relative">
                                 <ImageCarousel imageUrls={item.imageUrls} altText={item.name} isSold={item.status === 'Sold'} />
                                 <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-800 shadow-sm uppercase z-10">{item.status}</div>
                             </div>
                             <div className="p-5">
                                 <div className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">{item.category}</div>
                                 <h4 className="font-semibold text-gray-900 truncate text-lg mb-2">{item.name}</h4>
                                 <div className="mt-auto pt-2 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                                 </div>
                             </div>
                             
                             {/* Incoming Requests Mapping */}
                             {incomingRequests.filter(req => req.ProductID === item._id).length > 0 && (
                                 <div className="p-4 bg-orange-50 border-t border-orange-100">
                                     <h5 className="text-xs font-black text-orange-800 uppercase tracking-wider mb-3">Incoming Offers ({incomingRequests.filter(req => req.ProductID === item._id).length})</h5>
                                     <div className="space-y-3">
                                         {incomingRequests.filter(req => req.ProductID === item._id).map(req => (
                                             <div key={req.OrderID} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 flex flex-col">
                                                 <div className="flex justify-between items-start mb-2">
                                                     <div>
                                                         <span className="block text-sm font-bold text-gray-900">{req.BuyerName}</span>
                                                         <span className="block text-xs text-gray-500">📍 {req.BuyerUniversity}</span>
                                                     </div>
                                                     <span className="text-[10px] text-gray-400 font-medium">{new Date(req.OrderDate).toLocaleDateString()}</span>
                                                 </div>
                                                 <div className="flex space-x-2 mt-1">
                                                     <button onClick={() => handleAccept(req.OrderID)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-md transition shadow-sm">Accept</button>
                                                     <button onClick={() => handleReject(req.OrderID)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold py-2 rounded-md transition">Reject</button>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Profile;
