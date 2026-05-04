const API_URL = import.meta.env.VITE_API_URL  ;

export const donationsAPI = {
    async getAllDonations(filters) {
        let url = `${API_URL}/donations`;
        if (filters) {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch donations');
        }
        return response.json();
    },

    async getDonationById(id) {
        const response = await fetch(`${API_URL}/donations/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch donation');
        }
        return response.json();
    },

    async createDonation(donationData, token) {
        const response = await fetch(`${API_URL}/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(donationData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create donation');
        }

        return response.json();
    },

    async updateDonation(id, donationData, token) {
        const response = await fetch(`${API_URL}/donations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(donationData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update donation');
        }

        return response.json();
    },

    async deleteDonation(id, token) {
        const response = await fetch(`${API_URL}/donations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete donation');
        }

        return response.json();
    },

    async getMyDonations(token) {
        const response = await fetch(`${API_URL}/donations/donor/my-donations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch my donations');
        }

        return response.json();
    },
};
