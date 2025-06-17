import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminAuth.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

const router = express.Router();

// Apply protect and isAdmin middleware to all routes
router.use(protect, isAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tour', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Create a new tour
router.post('/tours', async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tour' });
  }
});

// Update a tour
router.put('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tour' });
  }
});

// Delete a tour
router.delete('/tours/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tour' });
  }
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

export default router; 