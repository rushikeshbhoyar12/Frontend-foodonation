import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { notificationsAPI } from '../api/notifications.js';
import { requestsAPI } from '../api/requests.js';
import {
    Heart,
    User,
    LogOut,
    Menu,
    X,
    Plus,
    LayoutDashboard,
    Bell
} from 'lucide-react';

export default function Navbar() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [requests, setRequests] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Fetch unread notifications count with filtering for donors
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (user && token) {
                try {
                    if (user.role === 'donor') {
                        // For donors, fetch all notifications and requests to apply filtering
                        const [notificationsData, requestsData] = await Promise.all([
                            notificationsAPI.getNotifications(token),
                            requestsAPI.getRequestsForMyDonations(token)
                        ]);

                        // Store the data
                        setNotifications(notificationsData);
                        setRequests(requestsData);

                        // Apply the same filtering logic as DonorDashboard
                        const relevantNotifications = notificationsData.filter((n) => {
                            // For request notifications, only show if the request is still pending
                            if (n.type === 'request') {
                                // Extract donation title from message (after "your" and before "donation")
                                const messageMatch = n.message.match(/your "([^"]+)" donation/);
                                const donationTitle = messageMatch ? messageMatch[1] : null;

                                // Extract requester name (before "has requested")
                                const requesterMatch = n.message.match(/^([^]+) has requested/);
                                const requesterName = requesterMatch ? requesterMatch[1] : null;

                                if (donationTitle && requesterName) {
                                    // Find the corresponding request that matches both title and receiver name
                                    const relatedRequest = requestsData.find((r) =>
                                        r.title === donationTitle &&
                                        r.receiver_name === requesterName
                                    );
                                    // Only show if request exists and is still pending
                                    return relatedRequest && relatedRequest.status === 'pending';
                                }
                                return false;
                            }
                            // Show completion notifications from last 7 days
                            if (n.type === 'completion') {
                                const notificationDate = new Date(n.created_at);
                                const sevenDaysAgo = new Date();
                                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                                return notificationDate > sevenDaysAgo;
                            }
                            return false;
                        });

                        // Count unread relevant notifications
                        const unreadRelevant = relevantNotifications.filter((n) => !n.is_read).length;
                        setUnreadCount(unreadRelevant);
                    } else {
                        // For non-donors, use the simple unread count
                        const data = await notificationsAPI.getUnreadCount(token);
                        setUnreadCount(data.count || 0);
                    }
                } catch (error) {
                    console.error('Error fetching unread count:', error);
                }
            }
        };

        fetchUnreadCount();

        // Set up interval to refresh count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, [user, token]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('[data-notifications-container]')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showNotifications]);

    // Get filtered notifications for donors (same logic as DonorDashboard)
    const getRelevantNotifications = () => {
        if (user?.role !== 'donor') return notifications;

        return notifications.filter((n) => {
            if (n.type === 'request') {
                const messageMatch = n.message.match(/your "([^"]+)" donation/);
                const donationTitle = messageMatch ? messageMatch[1] : null;
                const requesterMatch = n.message.match(/^([^]+) has requested/);
                const requesterName = requesterMatch ? requesterMatch[1] : null;

                if (donationTitle && requesterName) {
                    const relatedRequest = requests.find((r) =>
                        r.title === donationTitle && r.receiver_name === requesterName
                    );
                    return relatedRequest && relatedRequest.status === 'pending';
                }
                return false;
            }
            if (n.type === 'completion') {
                const notificationDate = new Date(n.created_at);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return notificationDate > sevenDaysAgo;
            }
            return false;
        });
    };

    // Mark notification as read
    const handleMarkAsRead = async (notificationId, event) => {
        event.stopPropagation();
        if (!token) return;

        try {
            await notificationsAPI.markAsRead(notificationId, token);
            setNotifications(prev => prev.map(notification =>
                notification._id === notificationId
                    ? { ...notification, is_read: true }
                    : notification
            ));
            // Refresh unread count
            const relevantNotifications = getRelevantNotifications().map(n =>
                n._id === notificationId ? { ...n, is_read: true } : n
            );
            const unreadRelevant = relevantNotifications.filter(n => !n.is_read).length;
            setUnreadCount(Math.max(0, unreadRelevant));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                        <Heart className="h-8 w-8 text-green-600" />
                        <span className="text-xl font-bold text-gray-800">FoodShare</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>
                                {user.role === 'donor' && (
                                    <Link
                                        to="/create-donation"
                                        className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>Donate</span>
                                    </Link>
                                )}
                                <div className="relative" data-notifications-container>
                                    <button
                                        onClick={toggleNotifications}
                                        className="relative text-gray-700 hover:text-green-600 transition-colors"
                                    >
                                        <Bell className="h-6 w-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                                <button
                                                    onClick={() => setShowNotifications(false)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {getRelevantNotifications().length === 0 ? (
                                                <div className="p-6 text-center text-gray-500">
                                                    No notifications
                                                </div>
                                            ) : (
                                                <div className="divide-y">
                                                    {getRelevantNotifications().map((notification) => (
                                                        <div
                                                            key={notification._id}
                                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.is_read ? 'bg-blue-50' : ''
                                                                }`}
                                                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-800 text-sm">
                                                                        {notification.title}
                                                                    </p>
                                                                    <p className="text-gray-600 text-xs mt-1">
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-gray-400 text-xs mt-2">
                                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                {!notification.is_read && (
                                                                    <span className="ml-2 h-2 w-2 bg-blue-500 rounded-full mt-1"></span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-700">{user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-green-600 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link
                            to="/"
                            className="block text-gray-700 hover:text-green-600 transition-colors py-2"
                            onClick={closeMenu}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="block text-gray-700 hover:text-green-600 transition-colors py-2"
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </Link>
                                {user.role === 'donor' && (
                                    <Link
                                        to="/create-donation"
                                        className="block text-gray-700 hover:text-green-600 transition-colors py-2"
                                        onClick={closeMenu}
                                    >
                                        Create Donation
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-gray-700 hover:text-green-600 transition-colors py-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-700 hover:text-green-600 transition-colors py-2"
                                    onClick={closeMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-gray-700 hover:text-green-600 transition-colors py-2"
                                    onClick={closeMenu}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
