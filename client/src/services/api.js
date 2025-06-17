import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored user data
      localStorage.removeItem('user');
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    // Clear user data from localStorage
    localStorage.removeItem('user');
    return response.data;
  } catch (error) {
    // Clear user data even if the request fails
    localStorage.removeItem('user');
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    // Clear user data if the request fails
    localStorage.removeItem('user');
    throw error.response?.data || error;
  }
};

// Tour services
export const getTours = async () => {
  try {
    const response = await api.get('/tours');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTourById = async (id) => {
  try {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Booking services
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 