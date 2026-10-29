import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchAdminData = async () => {
        try {
            const { data } = await axios.get('/api/admin/users');
            setStats(data.stats);
            setUsers(data.users);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching admin data', error);
            if (error.response && error.response.status === 401) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'Admin') {
            navigate('/');
            return;
        }
        fetchAdminData();
    }, [user, navigate]);

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you completely sure you want to permanently delete user ${name}? This will globally cascade and destroy all their products and orders!`)) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            alert('User successfully expunged from the database');
            fetchAdminData();
        } catch (error) {
            alert('Failed to delete user natively');
            console.error(error);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 min-h-screen">Loading System Hierarchy...</div>;
    if (!stats) return <div className="text-center py-20 text-red-500 min-h-screen">Administrator Auth Failed.</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight border-b pb-4">Global System Administrator</h1>
            
            {/* High-Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Total Users</span>
                    <span className="text-5xl font-black text-indigo-600">{stats.totalUsers}</span>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Total Products Listed</span>
                    <span className="text-5xl font-black text-blue-600">{stats.totalProducts}</span>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Total Orders Placed</span>
                    <span className="text-5xl font-black text-green-600">{stats.totalOrders}</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Database ({users.length})</h2>
            
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">User Profile</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Registration No.</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">University</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Role</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.UserID} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{u.UserID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shadow-inner">
                                                {u.Name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{u.Name}</div>
                                                <div className="text-sm text-gray-500">{u.Email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.RegNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.University}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider 
                                            ${u.Role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                                              u.Role === 'Seller' ? 'bg-orange-100 text-orange-800' : 
                                              u.Role === 'Both' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {u.Role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {u.Role !== 'Admin' && (
                                            <button 
                                                onClick={() => handleDeleteUser(u.UserID, u.Name)}
                                                className="text-red-500 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                                            >
                                                Expunge
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Products Table Integration */}
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Global Product Ecosystem ({products.length})</h2>
            
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Item Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Category</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Pricing</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Seller</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((p) => (
                                <tr key={p.ProductID} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{p.ProductID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{p.Title}</div>
                                        <div className="text-sm text-gray-500">{p.ItemCondition}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-bold uppercase">{p.CategoryName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{Number(p.Price).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{p.SellerName}</div>
                                        <div className="text-xs text-gray-500">📍 {p.University}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider 
                                            ${p.Status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.Status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
