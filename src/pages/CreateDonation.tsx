import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { donationsAPI } from '../api/donations';
import { Package, Calendar, MapPin, Phone, Upload, AlertCircle } from 'lucide-react';

const CreateDonation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    food_type: '',
    quantity: '',
    expiry_date: '',
    pickup_location: '',
    contact_info: user?.phone || '',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a donation');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem('token') || '';
      await donationsAPI.createDonation(formData, token);

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Donation</h1>
          <p className="text-gray-600 mt-2">
            Share your excess food to help those in need. Fill in the details below.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Donation Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., Fresh vegetables from my garden"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Describe what you're donating, its condition, and any other relevant details..."
            />
          </div>

          {/* Food Type and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="food_type" className="block text-sm font-medium text-gray-700">
                Food Type *
              </label>
              <div className="mt-1 relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  id="food_type"
                  name="food_type"
                  required
                  value={formData.food_type}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select food type</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="meat">Meat & Poultry</option>
                  <option value="grains">Grains & Cereals</option>
                  <option value="prepared_meals">Prepared Meals</option>
                  <option value="canned_goods">Canned Goods</option>
                  <option value="bakery">Bakery Items</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., 5 kg, 10 servings, 2 bags"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
              Expiry Date *
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                required
                min={getTomorrowDate()}
                value={formData.expiry_date}
                onChange={handleInputChange}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-700">
              Pickup Location *
            </label>
            <div className="mt-1 relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="pickup_location"
                name="pickup_location"
                required
                rows={2}
                value={formData.pickup_location}
                onChange={handleInputChange}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter the full address where recipients can pick up the donation..."
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
              Contact Information *
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="contact_info"
                name="contact_info"
                required
                value={formData.contact_info}
                onChange={handleInputChange}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Phone number or email for recipients to contact you"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              Image URL (Optional)
            </label>
            <div className="mt-1 relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Add a photo URL to help recipients see what you're donating
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Donation'}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">Tips for a successful donation:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Be specific about the quantity and condition of food</li>
            <li>• Provide clear pickup instructions and availability</li>
            <li>• Include multiple contact methods if possible</li>
            <li>• Make sure the expiry date is accurate</li>
            <li>• Add a photo to help recipients identify the donation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
