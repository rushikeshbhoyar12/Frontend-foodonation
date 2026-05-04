
import { Link } from 'react-router-dom';
import {
    Clock,
    MapPin,
    Package,
    Calendar,
    User
} from 'lucide-react';

export default function DonationCard({ donation, showActions = true }) {
    const getStatusColor = (status) => {
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

    const getStatusText = (status) => {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
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
                <Link
                    to={`/donation/${donation.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-green-600 mb-2 block transition-colors"
                >
                    {donation.title}
                </Link>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {donation.description}
                </p>

                {/* Details Grid */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{donation.quantity}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Expires: {formatDate(donation.expiry_date)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="line-clamp-1">{donation.pickup_location}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{donation.donor_name}</span>
                        {donation.donor_city && <span className="ml-2">• {donation.donor_city}</span>}
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>Posted: {formatDateTime(donation.created_at)}</span>
                    </div>
                </div>

                {/* Action Button */}
                {showActions && (
                    <Link
                        to={`/donation/${donation.id}`}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );
}
