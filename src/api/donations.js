const API_URL = import.meta.env.VITE_API_URL;

// Helper to transform MongoDB _id to id
const transformDonation = (donation) => {
    if (!donation) return null;
    return {
        ...donation,
        id: donation._id || donation.id
    };
};

const transformDonations = (donations) => {
    if (!donations) return [];
    return donations.map(transformDonation);
};

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
        const data = await response.json();
        return {
            donations: transformDonations(data.donations)
        };
    },

    async getDonationById(id) {
        const response = await fetch(`${API_URL}/donations/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch donation');
        }
        const data = await response.json();
        return {
            donation: transformDonation(data.donation)
        };
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

        const data = await response.json();
        return data;
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

        const data = await response.json();
        return {
            donations: transformDonations(data.donations)
        };
    },

    async getReceivedDonations(token) {
        const response = await fetch(`${API_URL}/donations/received/my-received`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch received donations');
        }

        const data = await response.json();
        return {
            donations: transformDonations(data.donations)
        };
    },
};
