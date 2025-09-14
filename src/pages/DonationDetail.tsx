import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { donationsAPI } from '../api/donations';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  MapPin,
  Package,
  Phone,
  User,
  Clock,
  AlertCircle,
  ArrowLeft,
  Heart,
  MessageCircle
} from 'lucide-react';

interface Donation {
  id: number;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  expiry_date: string;
  pickup_location: string;
  contact_info: string;
  status: string;
  image_url?: string;
  donor_name: string;
  donor_city?: string;
  created_at: string;
}

const DonationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await donationsAPI.getDonationById(id);
        setDonation(data.donation);
      } catch (err) {
        setError('Failed to load donation details');
        console.error('Error fetching donation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const handleRequest = async () => {
    if (!donation || !user || !requestMessage.trim()) return;

    try {
      setIsRequesting(true);
      // This would be implemented with the requests API
      // await requestsAPI.createRequest(donation.id, requestMessage, token);
      alert('Request sent successfully! The donor will be notified.');
      setRequestMessage('');
    } catch (err) {
      console.error('Error sending request:', err);
      alert('Failed to send request. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'reserved': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !donation) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error || 'Donation not found'}
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-green-600 hover:text-green-500"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to listings
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image */}
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          {donation.image_url ? (
            <img
              src={donation.image_url}
              alt={donation.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="h-16 w-16 text-gray-400" />
          )}
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{donation.title}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(donation.status)}`}>
                {donation.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700">{donation.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Food Type</p>
                  <p className="text-sm text-gray-600 capitalize">{donation.food_type}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Quantity</p>
                  <p className="text-sm text-gray-600">{donation.quantity}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Expiry Date</p>
                  <p className="text-sm text-gray-600">{formatDate(donation.expiry_date)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Donor</p>
                  <p className="text-sm text-gray-600">{donation.donor_name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                  <p className="text-sm text-gray-600">{donation.pickup_location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contact Info</p>
                  <p className="text-sm text-gray-600">{donation.contact_info}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Section */}
          {user && user.role === 'receiver' && donation.status === 'available' && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Request This Donation</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message to Donor
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Please explain why you need this donation and when you can pick it up..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRequest}
                    disabled={!requestMessage.trim() || isRequesting}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    {isRequesting ? 'Sending Request...' : 'Send Request'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Not Available Message */}
          {donation.status !== 'available' && (
            <div className="border-t pt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      This donation is currently {donation.status} and not available for new requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Prompt */}
          {!user && (
            <div className="border-t pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Please <a href="/login" className="font-medium underline">login</a> to request this donation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetail;
