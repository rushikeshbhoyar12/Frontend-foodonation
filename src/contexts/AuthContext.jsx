import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.js';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            loadProfile(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const loadProfile = async (authToken) => {
        try {
            const response = await authAPI.getProfile(authToken);
            setUser(response.user);
        } catch (error) {
            console.error('Failed to load profile:', error);
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await authAPI.login(email, password);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
    };

    const register = async (userData) => {
        const response = await authAPI.register(userData);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('token', response.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updateProfile = async (profileData) => {
        if (!token) throw new Error('No authentication token');
        await authAPI.updateProfile(profileData, token);
        // Reload profile to get updated data
        await loadProfile(token);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
