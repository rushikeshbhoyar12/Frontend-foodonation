import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../api/notifications';
import { requestsAPI } from '../api/requests';
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

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface Request {
  id: number;
  title: string;
  receiver_name: string;
  status: string;
}

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

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
            const relevantNotifications = notificationsData.filter((n: any) => {
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
                  const relatedRequest = requestsData.find((r: any) =>
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
            const unreadRelevant = relevantNotifications.filter((n: any) => !n.is_read).length;
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

  // Get filtered notifications for donors (same logic as DonorDashboard)
  const getRelevantNotifications = () => {
    if (user?.role !== 'donor') return notifications;

    return notifications.filter((n: any) => {
      if (n.type === 'request') {
        const messageMatch = n.message.match(/your "([^"]+)" donation/);
        const donationTitle = messageMatch ? messageMatch[1] : null;
        const requesterMatch = n.message.match(/^([^]+) has requested/);
        const requesterName = requesterMatch ? requesterMatch[1] : null;

        if (donationTitle && requesterName) {
          const relatedRequest = requests.find((r: any) =>
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
  const handleMarkAsRead = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!token) return;

    try {
      await notificationsAPI.markAsRead(notificationId.toString(), token);
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      ));
      // Refresh unread count
      const relevantNotifications = getRelevantNotifications();
      const unreadRelevant = relevantNotifications.filter((n: any) =>
        n.id === notificationId ? true : !n.is_read
      ).length - 1;
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
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {user.role === 'donor' && (
                  <Link
                    to="/create-donation"
                    className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Donate Food</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                          <span className="text-sm text-gray-500">{unreadCount} unread</span>
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto">
                        {getRelevantNotifications().length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          getRelevantNotifications().slice(0, 5).map((notification: any) => (
                            <div
                              key={notification.id}
                              className={`p-3 border-b border-gray-100 last:border-b-0 ${!notification.is_read ? 'bg-blue-50' : 'bg-white'
                                } hover:bg-gray-50 transition-colors`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 pr-2">
                                  <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                    {notification.title}
                                  </h4>
                                  <p className={`text-xs mt-1 ${!notification.is_read ? 'text-blue-700' : 'text-gray-600'
                                    }`}>
                                    {notification.message.length > 60
                                      ? notification.message.substring(0, 60) + '...'
                                      : notification.message
                                    }
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.type === 'request' ? 'bg-yellow-100 text-yellow-800' :
                                      notification.type === 'completion' ? 'bg-green-100 text-green-800' :
                                        notification.type === 'approval' ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'
                                    }`}>
                                    {notification.type}
                                  </span>

                                  {!notification.is_read && (
                                    <>
                                      <button
                                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                      >
                                        Mark read
                                      </button>
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowNotifications(false)}
                          className="block text-center text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          View all in dashboard →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  {user.role === 'donor' && (
                    <Link
                      to="/create-donation"
                      className="flex items-center space-x-2 text-green-600 font-medium"
                      onClick={closeMenu}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Donate Food</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile ({user.name})</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-green-600 font-medium"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}