const mongoose = require('mongoose');
const Tour = require('../models/Tour');
require('dotenv').config();

const tours = [
  {
    name: 'Paris City Explorer',
    description: 'Experience the magic of Paris with our comprehensive city tour. Visit the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
    price: 299,
    duration: 3,
    maxGroupSize: 15,
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    images: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
      'https://images.unsplash.com/photo-1543349689-9a4d426bee8e'
    ],
    featured: true,
    rating: 4.8,
    numReviews: 128
  },
  {
    name: 'Tokyo Adventure',
    description: 'Discover the vibrant city of Tokyo, from traditional temples to modern districts. Experience authentic Japanese culture and cuisine.',
    price: 599,
    duration: 5,
    maxGroupSize: 12,
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    images: [
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989'
    ],
    featured: true,
    rating: 4.9,
    numReviews: 95
  },
  {
    name: 'New York City Tour',
    description: 'Explore the Big Apple with our guided tour. Visit Times Square, Central Park, and the Statue of Liberty.',
    price: 399,
    duration: 4,
    maxGroupSize: 20,
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    images: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9'
    ],
    featured: false,
    rating: 4.7,
    numReviews: 156
  },
  {
    name: 'Rome Historical Tour',
    description: 'Step back in time with our Rome historical tour. Visit the Colosseum, Roman Forum, and Vatican City.',
    price: 349,
    duration: 3,
    maxGroupSize: 15,
    location: 'Rome, Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5'
    ],
    featured: true,
    rating: 4.8,
    numReviews: 112
  },
  {
    name: 'Bali Paradise',
    description: 'Experience the beauty of Bali with our island tour. Visit temples, beaches, and rice terraces.',
    price: 499,
    duration: 6,
    maxGroupSize: 10,
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4'
    ],
    featured: true,
    rating: 4.9,
    numReviews: 89
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tours
    await Tour.deleteMany({});
    console.log('Cleared existing tours');

    // Insert new tours
    await Tour.insertMany(tours);
    console.log('Seeded tours successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 