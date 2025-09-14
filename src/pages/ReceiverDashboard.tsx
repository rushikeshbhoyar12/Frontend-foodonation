import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { donationsAPI } from '../api/donations';
import { requestsAPI } from '../api/requests';
import { notificationsAPI } from '../api/notifications';
import DonationCard from '../components/DonationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Package, CheckCircle, Heart, Clock, X, Bell } from 'lucide-react';

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
  pickup_location: string;
  donor_name: string;
  donor_phone: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'request' | 'approval' | 'completion' | 'system' | 'rejection';
  is_read: boolean;
  created_at: string;
}

const ReceiverDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'available',
    food_type: '',
    city: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch available donations
        const donationsData = await donationsAPI.getAllDonations(filters);
        setDonations(donationsData.donations || []);

        // Fetch user's requests and notifications if token is available
        if (token) {
          const requestsData = await requestsAPI.getMyRequests(token);
          setRequests(requestsData || []);

          const notificationsData = await notificationsAPI.getNotifications(token);
          setNotifications(notificationsData || []);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, token]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCompleteRequest = async (requestId: number) => {
    if (!token) return;

    try {
      await requestsAPI.completeRequest(requestId.toString(), token);

      // Update the request status locally
      setRequests(prev => prev.map(request =>
        request.id === requestId
          ? { ...request, status: 'completed' as const }
          : request
      ));

      // Show success message
      alert('Request marked as completed successfully!');
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Failed to complete request. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Receiver Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Find food donations near you.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Donations</dt>
                  <dd className="text-lg font-medium text-gray-900">{donations.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Your Requests</dt>
                  <dd className="text-lg font-medium text-gray-900">{requests.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{requests.filter(r => r.status === 'completed').length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filter Donations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="food_type" className="block text-sm font-medium text-gray-700">
              Food Type
            </label>
            <select
              id="food_type"
              value={filters.food_type}
              onChange={(e) => handleFilterChange('food_type', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="grains">Grains</option>
              <option value="prepared_meals">Prepared Meals</option>
              <option value="canned_goods">Canned Goods</option>
              <option value="bakery">Bakery Items</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city name"
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Donations List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Donations</h2>
        {donations.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-600 mb-4">
              {filters.food_type || filters.city
                ? 'Try adjusting your filters to see more donations.'
                : 'There are no available donations at the moment. Check back later!'
              }
            </p>
            <button
              onClick={() => setFilters({ status: 'available', food_type: '', city: '' })}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Clear Filters
            </button>
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

      {/* My Requests Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
          <span className="text-sm text-gray-500">{requests.length} total</span>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse available donations and send your first request.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Browse Donations
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Donor:</span> {request.donor_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {request.food_type} •
                      <span className="font-medium"> Quantity:</span> {request.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Pickup:</span> {request.pickup_location}
                    </p>
                    {request.message && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Your message:</span> {request.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Requested on {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                      }`}>
                      {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {request.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {request.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
                      {request.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>

                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteRequest(request.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Completed
                      </button>
                    )}

                    {request.status === 'accepted' && (
                      <div className="text-xs text-gray-500 max-w-48 text-right">
                        Contact: {request.donor_phone}
                      </div>
                    )}
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
          <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
          <span className="text-sm text-gray-500">
            {notifications.filter(n => !n.is_read).length} unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${notification.is_read
                    ? 'bg-white border-gray-200'
                    : notification.type === 'completion'
                      ? 'bg-green-50 border-green-200'
                      : notification.type === 'approval'
                        ? 'bg-blue-50 border-blue-200'
                        : notification.type === 'rejection'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm mt-1 text-gray-600">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString()} at{' '}
                      {new Date(notification.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${notification.type === 'completion' ? 'bg-green-100 text-green-800' :
                        notification.type === 'approval' ? 'bg-blue-100 text-blue-800' :
                          notification.type === 'rejection' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
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

            {notifications.length > 5 && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Showing 5 most recent notifications
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-green-50 border border-green-200 rounded-md p-6">
        <div className="flex">
          <Heart className="h-6 w-6 text-green-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-green-900 mb-2">How to Request Food</h3>
            <p className="text-green-700 text-sm mb-4">
              Browse available donations and click on any item you're interested in. You can then send a request to the donor with a message explaining your need.
            </p>
            <Link
              to="/"
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              Browse All Donations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
