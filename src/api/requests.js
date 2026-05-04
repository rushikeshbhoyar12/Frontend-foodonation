const API_URL = import.meta.env.VITE_API_URL;

export const requestsAPI = {
    async createRequest(donationId, message, token) {
        const response = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ donationId, message }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create request');
        }

        return response.json();
    },

    async getMyRequests(token) {
        const response = await fetch(`${API_URL}/requests/my-requests`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch my requests');
        }

        return response.json();
    },

    async getRequestsForMyDonations(token) {
        const response = await fetch(`${API_URL}/requests/for-my-donations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch requests for donations');
        }

        return response.json();
    },

    async updateRequestStatus(requestId, status, token) {
        const response = await fetch(`${API_URL}/requests/${requestId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update request status');
        }

        return response.json();
    },

    async getRequestsForDonation(donationId, token) {
        const response = await fetch(`${API_URL}/requests/donation/${donationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch donation requests');
        }

        return response.json();
    },

    async completeRequest(requestId, token) {
        const response = await fetch(`${API_URL}/requests/${requestId}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to complete request');
        }

        return response.json();
    },
};
