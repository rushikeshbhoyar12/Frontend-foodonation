import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import UserManagement from '../components/UserManagement.jsx';
import ReportsGeneration from '../components/ReportsGeneration.jsx';
import { adminAPI } from '../api/admin.js';
import {
    Users,
    Package,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    UserCheck,
    Gift
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [showReportsGeneration, setShowReportsGeneration] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDonors: 0,
        totalReceivers: 0,
        totalDonations: 0,
        availableDonations: 0,
        completedDonations: 0,
        pendingRequests: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const data = await adminAPI.getStats();

                // Transform API response to match our Stats interface
                setStats({
                    totalUsers: data.users.total || 0,
                    totalDonors: data.users.donor || 0,
                    totalReceivers: data.users.receiver || 0,
                    totalDonations: data.donations.total || 0,
                    availableDonations: data.donations.available || 0,
                    completedDonations: data.donations.completed || 0,
                    pendingRequests: data.requests.pending || 0
                });
            } catch (err) {
                setError('Failed to load admin statistics');
                console.error('Error fetching admin stats:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchAdminStats();
        }
    }, [user]);

    // Quick action handlers
    const handleManageUsers = () => {
        setShowUserManagement(true);
    };

    const handleViewAllDonations = () => {
        navigate('/');
    };

    const handleGenerateReports = () => {
        setShowReportsGeneration(true);
    };

    if (loading) return <LoadingSpinner />;

    // Show user management view if requested
    if (showUserManagement) {
        return <UserManagement onBack={() => setShowUserManagement(false)} />;
    }

    // Show reports generation view if requested
    if (showReportsGeneration) {
        return <ReportsGeneration onBack={() => setShowReportsGeneration(false)} />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's your system overview.</p>
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

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Donations */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Package className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Donations</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalDonations}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Donations */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Gift className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Available Now</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.availableDonations}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completed Donations */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.completedDonations}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Donors */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UserCheck className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Donors</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalDonors}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receivers */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Receivers</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalReceivers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.pendingRequests}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                    <h2 className="text-lg font-medium text-gray-900">System Health</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">User Activity</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Donor Engagement</span>
                                <span className="text-green-600 font-medium">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Receiver Activity</span>
                                <span className="text-blue-600 font-medium">72%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Donation Success Rate</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Completion Rate</span>
                                <span className="text-purple-600 font-medium">78%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Response Time</span>
                                <span className="text-yellow-600 font-medium">Good</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={handleManageUsers}
                    className="bg-white shadow rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
                >
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-600 mt-1">View and manage all users</p>
                </button>

                <button
                    onClick={handleViewAllDonations}
                    className="bg-white shadow rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
                >
                    <Package className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">View All Donations</h3>
                    <p className="text-sm text-gray-600 mt-1">Browse all system donations</p>
                </button>

                <button
                    onClick={handleGenerateReports}
                    className="bg-white shadow rounded-lg p-6 text-left hover:shadow-lg transition-shadow"
                >
                    <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">Generate Reports</h3>
                    <p className="text-sm text-gray-600 mt-1">Create system reports</p>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
