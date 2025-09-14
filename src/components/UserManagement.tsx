import { useState, useEffect } from 'react';
import {
    Users,
    Edit3,
    Trash2,
    Search,
    Filter,
    UserCheck,
    UserX,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowLeft
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'donor' | 'receiver' | 'admin';
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    created_at: string;
    updated_at: string;
}

interface UserManagementProps {
    onBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // For now, using mock data since we don't have a users API endpoint yet
            // In a real app, this would be: const response = await usersAPI.getAllUsers(token);
            const mockUsers: User[] = [
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

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'donor': return 'bg-green-100 text-green-800';
            case 'receiver': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (user: User) => {
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

    const formatDate = (dateString: string) => {
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
                            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="donor">Donor</option>
                            <option value="receiver">Receiver</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {filteredUsers.length} results
                        </span>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
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
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <UserCheck className="h-5 w-5 text-gray-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.phone ? (
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 text-gray-400 mr-1" />
                                            {user.phone}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">No phone</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.city && user.state ? (
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                            {user.city}, {user.state}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Not provided</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                        {formatDate(user.created_at)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                    >
                                        <Edit3 className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600">
                            {searchTerm || roleFilter ? 'Try adjusting your filters.' : 'No users in the system yet.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Edit User: {editingUser.name}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                                <select
                                                    value={editingUser.role}
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'donor' | 'receiver' | 'admin' })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                >
                                                    <option value="receiver">Receiver</option>
                                                    <option value="donor">Donor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={editingUser.phone || ''}
                                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSaveUser}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingUser(null);
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;