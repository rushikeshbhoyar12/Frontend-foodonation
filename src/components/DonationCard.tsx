import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Package, 
  Calendar,
  User,
  Phone
} from 'lucide-react';

interface DonationCardProps {
  donation: {
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
  };
  showActions?: boolean;
}

export default function DonationCard({ donation, showActions = true }: DonationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'reserved':
        return 'Reserved';
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      {donation.image_url && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={donation.image_url}
            alt={donation.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Status and Food Type */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
            {getStatusText(donation.status)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {donation.food_type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {donation.title}
        </h3>

        {/* Description */}
        {donation.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {donation.description}
          </p>
        )}

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-medium">Quantity:</span>
            <span className="ml-1">{donation.quantity}</span>
          </div>

          {donation.expiry_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              <span className="font-medium">Expires:</span>
              <span className="ml-1">{formatDate(donation.expiry_date)}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-red-600" />
            <span className="font-medium">Location:</span>
            <span className="ml-1 line-clamp-1">{donation.pickup_location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">Donor:</span>
            <span className="ml-1">{donation.donor_name}</span>
            {donation.donor_city && <span className="ml-1 text-gray-500">• {donation.donor_city}</span>}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Posted {formatDateTime(donation.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="pt-4 border-t border-gray-100">
            <Link
              to={`/donation/${donation.id}`}
              className="w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 inline-block"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}