import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { donationsAPI } from '../api/donations.js';
import { requestsAPI } from '../api/requests.js';
import { notificationsAPI } from '../api/notifications.js';
import DonationCard from '../components/DonationCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Search, Package, CheckCircle, Heart, Clock, X, Bell } from 'lucide-react';

const ReceiverDashboard = () => {
    const { user, token } = useAuth();
    const [donations, setDonations] = useState([]);
    const [receivedDonations, setReceivedDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

                    // Fetch received donations
                    const receivedData = await donationsAPI.getReceivedDonations(token);
                    setReceivedDonations(receivedData.donations || []);
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

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCompleteRequest = async (requestId) => {
        if (!token) return;

        try {
            await requestsAPI.completeRequest(requestId.toString(), token);

            // Update the request status locally
            setRequests(prev => prev.map(request =>
                request.id === requestId
                    ? { ...request, status: 'completed' }
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Donations Received</dt>
                                    <dd className="text-lg font-medium text-gray-900">{receivedDonations.length}</dd>
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
                            <option value="meat">Meat & Poultry</option>
                            <option value="grains">Grains & Cereals</option>
                            <option value="prepared_meals">Prepared Meals</option>
                            <option value="canned_goods">Canned Goods</option>
                            <option value="bakery">Bakery Items</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            id="city"
                            type="text"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            placeholder="Search by city"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
            </div>

            {/* Your Requests */}
            {requests.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-blue-600" />
                        Your Requests
                    </h2>
                    <div className="space-y-4">
                        {requests.map(request => (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                                        <p className="text-sm text-gray-600">From: {request.donor_name}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{request.message}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm text-gray-600">
                                    <div><span className="font-medium">Quantity:</span> {request.quantity}</div>
                                    <div><span className="font-medium">Location:</span> {request.pickup_location}</div>
                                    <div><span className="font-medium">Phone:</span> {request.donor_phone}</div>
                                </div>
                                {request.status === 'accepted' && (
                                    <button
                                        onClick={() => handleCompleteRequest(request.id)}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Received Donations */}
            {receivedDonations.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                        Your Received Donations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {receivedDonations.map(donation => (
                            <div key={donation.id} className="border border-purple-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                {donation.image_url && (
                                    <img src={donation.image_url} alt={donation.title} className="w-full h-48 object-cover" />
                                )}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{donation.title}</h3>
                                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                            Received
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">From: {donation.donor_name}</p>
                                    <p className="text-sm text-gray-700 mb-3">{donation.description}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                        <div><span className="font-medium">Type:</span> {donation.food_type}</div>
                                        <div><span className="font-medium">Quantity:</span> {donation.quantity}</div>
                                        <div><span className="font-medium">Location:</span> {donation.donor_city}</div>
                                        <div><span className="font-medium">Phone:</span> {donation.donor_phone}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
