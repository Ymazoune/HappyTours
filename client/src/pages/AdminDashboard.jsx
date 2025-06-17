import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddTourForm from '../components/AddTourForm';
import BookingManager from '../components/BookingManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalTours: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, bookingsRes, toursRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', { withCredentials: true }),
          axios.get('http://localhost:5000/api/admin/bookings', { withCredentials: true }),
          axios.get('http://localhost:5000/api/tours', { withCredentials: true })
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalBookings: bookingsRes.data.length,
          totalTours: toursRes.data.length
        });
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/admin/login');
        } else {
          setError(err.response?.data?.message || 'Error fetching stats');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleTourAdded = () => {
    // Refresh stats after adding a new tour
    setStats(prev => ({
      ...prev,
      totalTours: prev.totalTours + 1
    }));
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tours')}
              className={`${
                activeTab === 'tours'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Tours
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`${
                activeTab === 'bookings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Bookings
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalBookings}</dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tours</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalTours}</dd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tours' && (
            <div className="p-6">
              <AddTourForm onTourAdded={handleTourAdded} />
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="p-6">
              <BookingManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 