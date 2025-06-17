import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getTours } from '../services/api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    priceRange: 'all',
    duration: 'all'
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(data);
      } catch (err) {
        setError('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredTours = tours.filter(tour => {
    const matchesLocation = tour.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice = filters.priceRange === 'all' || 
      (filters.priceRange === 'budget' && tour.price < 1000) ||
      (filters.priceRange === 'mid' && tour.price >= 1000 && tour.price < 2000) ||
      (filters.priceRange === 'luxury' && tour.price >= 2000);
    const matchesDuration = filters.duration === 'all' ||
      (filters.duration === 'short' && tour.duration <= 3) ||
      (filters.duration === 'medium' && tour.duration > 3 && tour.duration <= 7) ||
      (filters.duration === 'long' && tour.duration > 7);

    return matchesLocation && matchesPrice && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Our Tours</h1>
          <p className="text-xl text-gray-600">Find your perfect adventure from our curated collection of tours</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget ($0 - $999)</option>
                <option value="mid">Mid-Range ($1000 - $1999)</option>
                <option value="luxury">Luxury ($2000+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (1-3 days)</option>
                <option value="medium">Medium (4-7 days)</option>
                <option value="long">Long (8+ days)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No tours found</h3>
            <p className="text-gray-600">Try adjusting your filters to find more tours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{tour.name}</h3>
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
                      {tour.duration} days
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold">${tour.price}</span>
                      <span className="text-gray-600 text-sm"> /person</span>
                    </div>
                    <Link
                      to={`/tours/${tour._id}`}
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours; 