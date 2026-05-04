import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { donationsAPI } from '../api/donations.js';
import DonationCard from '../components/DonationCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
    Heart,
    Users,
    Utensils,
    Search,
    Filter,
    MapPin,
    ArrowRight
} from 'lucide-react';

export default function Home() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFoodType, setSelectedFoodType] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const loadDonations = useCallback(async () => {
        try {
            setLoading(true);
            const filters = { status: 'available' };
            if (selectedFoodType) filters.food_type = selectedFoodType;
            if (selectedCity) filters.city = selectedCity;

            const data = await donationsAPI.getAllDonations(filters);
            setDonations(data.donations || []);
        } catch (error) {
            console.error('Failed to load donations:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedFoodType, selectedCity]);

    useEffect(() => {
        loadDonations();
    }, [loadDonations]);

    const filteredDonations = donations.filter((donation) =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const foodTypes = ['Vegetables', 'Fruits', 'Prepared Meals', 'Canned Goods', 'Bakery Items', 'Dairy', 'Grains'];

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
                <div className="max-w-4xl mx-auto px-6">
                    <Heart className="h-16 w-16 text-green-600 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Reducing Food Waste,
                        <span className="text-green-600"> Feeding Communities</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Connect food donors with those in need. Join our mission to eliminate food waste
                        while helping communities access fresh, quality food.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            Start Helping Today <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-all duration-200"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{donations.length}+</h3>
                    <p className="text-gray-600">Active Food Donations</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                    <p className="text-gray-600">Community Members</p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">1,200+</h3>
                    <p className="text-gray-600">Meals Saved</p>
                </div>
            </section>

            {/* Available Donations Section */}
            <section>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Food Donations</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse fresh food donations from local restaurants, grocery stores, and community members.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search donations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <select
                                value={selectedFoodType}
                                onChange={(e) => setSelectedFoodType(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">All Food Types</option>
                                {foodTypes.map(type => (
                                    <option key={type} value={type.toLowerCase()}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative">
                            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by city..."
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Donations Grid */}
                {loading ? (
                    <LoadingSpinner />
                ) : filteredDonations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDonations.map(donation => (
                            <DonationCard key={donation.id} donation={donation} showActions={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No donations available</h3>
                        <p className="text-gray-600">
                            Try adjusting your filters or check back later for more donations.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
