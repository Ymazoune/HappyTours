import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTours } from '../services/tourService';

const Tours = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('location');

  // Filter states
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [priceError, setPriceError] = useState('');
  const [duration, setDuration] = useState('all');
  const [featured, setFeatured] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  // Add this function to handle price input
  const handlePriceChange = (field, value) => {
    // Clear any previous error
    setPriceError('');
    
    // Allow empty value
    if (value === '') {
      setPriceRange(prev => ({ ...prev, [field]: '' }));
      return;
    }

    // Check if input is a valid number
    if (!/^\d*$/.test(value)) {
      setPriceError('Please enter numbers only');
      return;
    }

    // Update the price range
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        console.log('Fetching tours...');
        const data = await getTours();
        
        // Filter tours if location query exists
        if (locationQuery) {
          const filteredTours = data.filter(tour => 
            tour.location.toLowerCase().includes(locationQuery.toLowerCase())
          );
          setTours(filteredTours);
        } else {
          setTours(data);
        }
        setFilteredTours(data);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchTours:', err);
        setError('Failed to fetch tours. Please try again later.');
        setLoading(false);
      }
    };

    fetchTours();
  }, [locationQuery]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tours];

    // Apply search filter
    if (search) {
      result = result.filter(tour => 
        tour.name.toLowerCase().includes(search.toLowerCase()) ||
        tour.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price range filter
    if (priceRange.min !== '' && priceRange.max !== '') {
      const min = parseInt(priceRange.min);
      const max = parseInt(priceRange.max);
      
      if (!isNaN(min) && !isNaN(max)) {
        result = result.filter(tour => 
          tour.price >= min && tour.price <= max
        );
      }
    }

    // Apply duration filter
    if (duration !== 'all') {
      result = result.filter(tour => tour.duration === parseInt(duration));
    }

    // Apply featured filter
    if (featured) {
      result = result.filter(tour => tour.featured);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting (newest first)
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredTours(result);
  }, [tours, search, priceRange, duration, featured, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl text-gray-600">Loading tours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-black text-center">
        {locationQuery ? `Tours in ${locationQuery}` : 'All Tours'}
      </h1>
      {locationQuery && tours.length === 0 && (
        <p className="text-center text-gray-600">No tours found for this location.</p>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <span>-</span>
              <input
                type="text"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            {priceError && (
              <p className="mt-1 text-sm text-red-600">{priceError}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Durations</option>
              <option value="1">1 Day</option>
              <option value="2">2 Days</option>
              <option value="3">3 Days</option>
              <option value="4">4 Days</option>
              <option value="5">5 Days</option>
              <option value="6">6 Days</option>
              <option value="7">7 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="default">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Featured Filter */}
        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Show featured tours only</span>
          </label>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTours.map((tour) => (
          <div
            key={tour._id}
            onClick={() => navigate(`/tours/${tour._id}`)}
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover"
              />
              {tour.featured && (
                <span className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded">
                  Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-black mb-2">{tour.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{tour.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-black font-semibold">${tour.price}</span>
                <span className="text-gray-600 text-sm">{tour.duration} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No tours found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default Tours; 