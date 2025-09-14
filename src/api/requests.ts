const API_URL = 'http://localhost:5000/api';

export const requestsAPI = {
  async createRequest(donationId: number, message: string, token: string) {
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

  async getMyRequests(token: string) {
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

  async getRequestsForMyDonations(token: string) {
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

  async updateRequestStatus(requestId: string, status: string, token: string) {
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

  async getRequestsForDonation(donationId: string, token: string) {
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

  async completeRequest(requestId: string, token: string) {
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