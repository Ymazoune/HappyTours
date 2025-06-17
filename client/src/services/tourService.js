import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTours = async () => {
  try {
    const response = await axios.get(`${API_URL}/tours`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};

export const getTourById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tours/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour:', error);
    throw error;
  }
}; 