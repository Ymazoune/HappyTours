import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBookings } from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        if (err.message === 'Not authenticated') {
          navigate('/login', { 
            state: { 
              from: '/my-bookings',
              message: 'Please log in to view your bookings'
            }
          });
        } else {
          setError('Failed to fetch bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Message */}
      {location.state?.message && (
        <div className="mb-8 p-4 bg-green-50 text-black rounded-md">
          {location.state.message}
        </div>
      )}

      <h1 className="text-3xl font-bold text-black mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-black text-lg">You haven't made any bookings yet.</p>
          <button
            onClick={() => navigate('/tours')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Browse Tours
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={booking.tour.image}
                alt={booking.tour.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-black mb-2">
                  {booking.tour.name}
                </h2>
                <div className="space-y-2 text-black">
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Participants:</span>{' '}
                    {booking.participants}
                  </p>
                  <p>
                    <span className="font-medium">Total Price:</span> $
                    {booking.totalPrice}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/tours/${booking.tour._id}`)}
                    className="w-full text-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
                  >
                    View Tour Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 