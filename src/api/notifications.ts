const API_URL = 'http://localhost:5000/api';

export const notificationsAPI = {
    async getNotifications(token: string) {
        const response = await fetch(`${API_URL}/notifications`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        return response.json();
    },

    async markAsRead(notificationId: string, token: string) {
        const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to mark notification as read');
        }

        return response.json();
    },

    async markAllAsRead(token: string) {
        const response = await fetch(`${API_URL}/notifications/read-all`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to mark all notifications as read');
        }

        return response.json();
    },

    async getUnreadCount(token: string) {
        const response = await fetch(`${API_URL}/notifications/unread-count`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch unread count');
        }

        return response.json();
    },
};