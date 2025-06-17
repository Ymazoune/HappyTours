import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/api';

const BookingForm = ({ tour }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    participants: 1,
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return (formData.participants * tour.price).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        tourId: tour._id,
        date: formData.date,
        participants: parseInt(formData.participants),
        totalPrice: calculateTotal(),
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };

      if (!bookingData.date) {
        throw new Error('Please select a date');
      }

      if (!bookingData.participants || bookingData.participants < 1) {
        throw new Error('Number of participants must be at least 1');
      }

      console.log('Sending booking data:', bookingData);
      const response = await createBooking(bookingData);
      console.log('Booking created:', response);
      navigate('/my-bookings', { state: { message: 'Booking created successfully!' } });
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Book This Tour</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Number of Participants
          </label>
          <input
            type="number"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium text-black">Total Price:</span>
            <span className="font-bold text-black">${calculateTotal()}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm; 