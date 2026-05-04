import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { donationsAPI } from '../api/donations.js';
import { notificationsAPI } from '../api/notifications.js';
import { requestsAPI } from '../api/requests.js';
import DonationCard from '../components/DonationCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Plus, Package, Clock, CheckCircle, AlertCircle, Bell, Eye, User, Phone } from 'lucide-react';

const DonorDashboard = () => {
    const { user, token } = useAuth();
    const [donations, setDonations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                const available = donationsData.donations?.filter((d) => d.status === 'available').length || 0;
                const reserved = donationsData.donations?.filter((d) => d.status === 'reserved').length || 0;
                const completed = donationsData.donations?.filter((d) => d.status === 'completed').length || 0;

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

    const handleAcceptRequest = async (requestId) => {
        if (!token) return;

        try {
            await requestsAPI.updateRequestStatus(requestId.toString(), 'accepted', token);

            // Update requests locally
            setRequests(prev => prev.map(request =>
                request.id === requestId
                    ? { ...request, status: 'accepted' }
                    : request
            ));

            // Update donation status to reserved locally
            const request = requests.find(r => r.id === requestId);
            if (request) {
                setDonations(prev => prev.map(donation =>
                    donation.id === request.donation_id
                        ? { ...donation, status: 'reserved' }
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

    const handleRejectRequest = async (requestId) => {
        if (!token) return;

        try {
            await requestsAPI.updateRequestStatus(requestId.toString(), 'rejected', token);

            // Update requests locally
            setRequests(prev => prev.map(request =>
                request.id === requestId
                    ? { ...request, status: 'rejected' }
                    : request
            ));

            alert('Request rejected.');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request. Please try again.');
        }
    };

    const handleCompleteRequest = async (requestId) => {
        if (!token) return;

        try {
            await requestsAPI.updateRequestStatus(requestId.toString(), 'completed', token);

            // Update requests locally
            setRequests(prev => prev.map(request =>
                request.id === requestId
                    ? { ...request, status: 'completed' }
                    : request
            ));

            // Update donation status to completed locally
            const request = requests.find(r => r.id === requestId);
            if (request) {
                setDonations(prev => prev.map(donation =>
                    donation.id === request.donation_id
                        ? { ...donation, status: 'completed' }
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
            if (n.type === 'request') {
                const messageMatch = n.message.match(/your "([^"]+)" donation/);
                const donationTitle = messageMatch ? messageMatch[1] : null;
                const requesterMatch = n.message.match(/^([^]+) has requested/);
                const requesterName = requesterMatch ? requesterMatch[1] : null;

                if (donationTitle && requesterName) {
                    const relatedRequest = requests.find(r =>
                        r.title === donationTitle &&
                        r.receiver_name === requesterName
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

    const handleMarkAsRead = async (notificationId) => {
        if (!token) return;

        try {
            await notificationsAPI.markAsRead(notificationId.toString(), token);
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

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const relevantNotifications = getRelevantNotifications();

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

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-blue-600" />
                        Pending Requests ({pendingRequests.length})
                    </h2>
                    <div className="space-y-4">
                        {pendingRequests.map(request => (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">Requested by: {request.receiver_name}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                        {request.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm text-gray-600">
                                    <div><span className="font-medium">Phone:</span> {request.receiver_phone}</div>
                                    <div><span className="font-medium">Email:</span> {request.receiver_email}</div>
                                    <div><span className="font-medium">Quantity:</span> {request.quantity}</div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                        className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(request.id)}
                                        className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* My Donations Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">My Donations</h2>
                {donations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donations.map(donation => (
                            <DonationCard key={donation.id} donation={donation} showActions={false} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">You haven't created any donations yet. <Link to="/create-donation" className="text-green-600 font-medium">Create one now!</Link></p>
                )}
            </div>
        </div>
    );
};

export default DonorDashboard;
