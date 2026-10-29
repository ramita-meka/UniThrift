import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // Set default headers for subsequent requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (err) {
                console.error("Local storage token parse error", err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('/api/auth/register', userData);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
