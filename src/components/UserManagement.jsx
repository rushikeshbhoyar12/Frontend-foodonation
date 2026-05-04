import { useState, useEffect } from 'react';
import {
    Users,
    Edit3,
    Trash2,
    Search,
    Filter,
    UserCheck,
    UserX,
    Phone,
    MapPin,
    Calendar,
    ArrowLeft
} from 'lucide-react';

const UserManagement = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // For now, using mock data since we don't have a users API endpoint yet
            // In a real app, this would be: const response = await usersAPI.getAllUsers(token);
            const mockUsers = [
                {
                    id: 1,
                    name: 'John Admin',
                    email: 'admin@fooddonation.com',
                    role: 'admin',
                    phone: '+1-234-567-8901',
                    city: 'New York',
                    state: 'NY',
                    created_at: '2024-01-15T10:30:00Z',
                    updated_at: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    name: 'Jane Donor',
                    email: 'jane@example.com',
                    role: 'donor',
                    phone: '+1-234-567-8902',
                    address: '123 Main St',
                    city: 'Los Angeles',
                    state: 'CA',
                    zip_code: '90210',
                    created_at: '2024-02-10T14:20:00Z',
                    updated_at: '2024-02-10T14:20:00Z'
                },
                {
                    id: 3,
                    name: 'Bob Receiver',
                    email: 'bob@example.com',
                    role: 'receiver',
                    phone: '+1-234-567-8903',
                    city: 'Chicago',
                    state: 'IL',
                    created_at: '2024-02-15T09:15:00Z',
                    updated_at: '2024-02-15T09:15:00Z'
                },
                {
                    id: 4,
                    name: 'Alice Donor',
                    email: 'alice@example.com',
                    role: 'donor',
                    phone: '+1-234-567-8904',
                    city: 'Houston',
                    state: 'TX',
                    created_at: '2024-03-01T16:45:00Z',
                    updated_at: '2024-03-01T16:45:00Z'
                },
                {
                    id: 5,
                    name: 'Charlie Receiver',
                    email: 'charlie@example.com',
                    role: 'receiver',
                    city: 'Phoenix',
                    state: 'AZ',
                    created_at: '2024-03-05T11:30:00Z',
                    updated_at: '2024-03-05T11:30:00Z'
                }
            ];

            setUsers(mockUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === '' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'donor': return 'bg-green-100 text-green-800';
            case 'receiver': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        if (window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
            // In a real app, this would call: await usersAPI.deleteUser(user.id, token);
            setUsers(users.filter(u => u.id !== user.id));
        }
    };

    const handleSaveUser = () => {
        if (editingUser) {
            // In a real app, this would call: await usersAPI.updateUser(editingUser.id, editingUser, token);
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
            setIsEditModalOpen(false);
            setEditingUser(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center">
                        <Users className="h-6 w-6 text-gray-600 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Total Users: {users.length}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="donor">Donor</option>
                            <option value="receiver">Receiver</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDate(user.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No users found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
