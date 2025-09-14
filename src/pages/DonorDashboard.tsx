import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { donationsAPI } from '../api/donations';
import { notificationsAPI } from '../api/notifications';
import { requestsAPI } from '../api/requests';
import DonationCard from '../components/DonationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Package, Clock, CheckCircle, AlertCircle, Bell, Eye, User, Phone } from 'lucide-react';

interface Donation {
  id: number;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  expiry_date: string;
  pickup_location: string;
  contact_info: string;
  status: 'available' | 'reserved' | 'completed' | 'expired';
  image_url?: string;
  donor_name: string;
  donor_city?: string;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'request' | 'approval' | 'completion' | 'system';
  is_read: boolean;
  created_at: string;
}

interface Request {
  id: number;
  donation_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  requested_at: string;
  title: string;
  food_type: string;
  quantity: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_email: string;
}

const DonorDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem('token') || '';

        // Fetch donations
        const donationsData = await donationsAPI.getMyDonations(authToken);
        setDonations(donationsData.donations || []);

        // Calculate stats
        const total = donationsData.donations?.length || 0;
        const available = donationsData.donations?.filter((d: Donation) => d.status === 'available').length || 0;
        const reserved = donationsData.donations?.filter((d: Donation) => d.status === 'reserved').length || 0;
        const completed = donationsData.donations?.filter((d: Donation) => d.status === 'completed').length || 0;

        setStats({ total, available, reserved, completed });

        // Fetch notifications and requests
        if (authToken) {
          const notificationsData = await notificationsAPI.getNotifications(authToken);
          setNotifications(notificationsData || []);

          const requestsData = await requestsAPI.getRequestsForMyDonations(authToken);
          setRequests(requestsData || []);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'donor') {
      fetchData();
    }
  }, [user, token]);

  const handleAcceptRequest = async (requestId: number) => {
    if (!token) return;

    try {
      await requestsAPI.updateRequestStatus(requestId.toString(), 'accepted', token);

      // Update requests locally
      setRequests(prev => prev.map(request =>
        request.id === requestId
          ? { ...request, status: 'accepted' as const }
          : request
      ));

      // Update donation status to reserved locally
      const request = requests.find(r => r.id === requestId);
      if (request) {
        setDonations(prev => prev.map(donation =>
          donation.id === request.donation_id
            ? { ...donation, status: 'reserved' as const }
            : donation
        ));

        // Update stats
        setStats(prev => ({
          ...prev,
          available: prev.available - 1,
          reserved: prev.reserved + 1
        }));
      }

      alert('Request accepted successfully!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    if (!token) return;

    try {
      await requestsAPI.updateRequestStatus(requestId.toString(), 'rejected', token);

      // Update requests locally
      setRequests(prev => prev.map(request =>
        request.id === requestId
          ? { ...request, status: 'rejected' as const }
          : request
      ));

      alert('Request rejected.');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    if (!token) return;

    try {
      await requestsAPI.updateRequestStatus(requestId.toString(), 'completed', token);

      // Update requests locally
      setRequests(prev => prev.map(request =>
        request.id === requestId
          ? { ...request, status: 'completed' as const }
          : request
      ));

      // Update donation status to completed locally
      const request = requests.find(r => r.id === requestId);
      if (request) {
        setDonations(prev => prev.map(donation =>
          donation.id === request.donation_id
            ? { ...donation, status: 'completed' as const }
            : donation
        ));

        // Update stats - only decrease reserved if it's currently reserved
        setStats(prev => ({
          ...prev,
          reserved: Math.max(0, prev.reserved - 1),
          completed: prev.completed + 1
        }));
      }

      alert('Donation marked as completed!');
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Failed to complete request. Please try again.');
    }
  };

  // Helper function to filter relevant notifications for donors
  const getRelevantNotifications = () => {
    return notifications.filter(n => {
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
          const relatedRequest = requests.find(r =>
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
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: number) => {
    if (!token) return;

    try {
      await notificationsAPI.markAsRead(notificationId.toString(), token);
      // Update notifications locally
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      ));
      alert('Notification marked as read!');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Failed to mark notification as read.');
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!token) return;

    try {
      await notificationsAPI.markAllAsRead(token);
      // Update all notifications locally
      setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
      alert('All notifications marked as read!');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      alert('Failed to mark all notifications as read.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>
        <Link
          to="/create-donation"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Donation
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Donations</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.available}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Reserved</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.reserved}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Requests Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
          <span className="text-sm text-gray-500">
            {requests.filter(r => r.status === 'pending').length} pending
          </span>
        </div>

        {requests.filter(r => r.status === 'pending').length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <User className="w-4 h-4 inline mr-1" />
                        <span className="font-medium">Requester:</span> {request.receiver_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Phone className="w-4 h-4 inline mr-1" />
                        <span className="font-medium">Phone:</span> {request.receiver_phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span> {request.food_type} •
                        <span className="font-medium"> Quantity:</span> {request.quantity}
                      </p>
                      {request.message && (
                        <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">
                          <span className="font-medium">Message:</span> "{request.message}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Requested on {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Requests (Ready for Completion) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Ready for Pickup</h2>
          <span className="text-sm text-gray-500">
            {requests.filter(r => r.status === 'accepted').length} accepted
          </span>
        </div>

        {requests.filter(r => r.status === 'accepted').length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No items ready for pickup</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.filter(r => r.status === 'accepted').map((request) => (
              <div key={request.id} className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-green-900">{request.title}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-green-700">
                        <User className="w-4 h-4 inline mr-1" />
                        <span className="font-medium">Contact:</span> {request.receiver_name}
                      </p>
                      <p className="text-sm text-green-700">
                        <Phone className="w-4 h-4 inline mr-1" />
                        <span className="font-medium">Phone:</span> {request.receiver_phone}
                      </p>
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Status:</span> Ready for pickup
                      </p>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleCompleteRequest(request.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notifications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {getRelevantNotifications().filter(n => !n.is_read).length} unread
            </span>
            {getRelevantNotifications().some(n => !n.is_read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {getRelevantNotifications().length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No recent notifications</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getRelevantNotifications()
              .slice(0, 5)
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${notification.is_read
                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${notification.is_read ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${notification.is_read ? 'text-gray-600' : 'text-blue-700'
                        }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleDateString()} at{' '}
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </p>
                      {!notification.is_read && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          Click to mark as read
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${notification.type === 'request' ? 'bg-yellow-100 text-yellow-800' :
                        notification.type === 'completion' ? 'bg-green-100 text-green-800' :
                          notification.type === 'approval' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {notification.type}
                      </span>

                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {getRelevantNotifications().length > 5 && (
              <div className="text-center">
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  <Eye className="w-4 h-4 inline mr-1" />
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Donations List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Donations</h2>
        {donations.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600 mb-4">Start making a difference by creating your first donation.</p>
            <Link
              to="/create-donation"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Donation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
