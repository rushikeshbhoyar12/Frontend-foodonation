const API_URL = 'http://localhost:5000/api';

export interface AdminStats {
    users: {
        total: number;
        donor: number;
        receiver: number;
        admin: number;
    };
    donations: {
        total: number;
        available: number;
        completed: number;
        expired: number;
    };
    requests: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    recentActivity: {
        donations: number;
    };
}

export const adminAPI = {
    async getStats(): Promise<AdminStats> {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/admin/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch admin statistics');
        }

        return response.json();
    },

    async getUsers() {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch users');
        }

        return response.json();
    },

    async updateUser(userId: number, userData: any) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }

        return response.json();
    },

    async deleteUser(userId: number) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }

        return response.json();
    }
};