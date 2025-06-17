import express from 'express';
import { protect } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

const router = express.Router();

// Get all bookings for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user.id })
      .populate('tour')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Create a new booking
router.post('/', protect, async (req, res) => {
  try {
    const { tour, date, participants, totalPrice, contactInfo } = req.body;

    // Check if tour exists
    const tourExists = await Tour.findById(tour);
    if (!tourExists) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.session.user.id,
      tour,
      date,
      participants,
      totalPrice,
      contactInfo
    });

    // Populate tour details
    await booking.populate('tour');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get a single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.session.user.id
    }).populate('tour');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Cancel a booking
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.session.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

export default router; 