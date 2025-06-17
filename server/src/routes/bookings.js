import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'name image location price duration')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/', [
  protect,
  body('tourId').notEmpty().withMessage('Tour ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('participants').isInt({ min: 1 }).withMessage('Number of participants must be at least 1'),
  body('contactInfo.name').notEmpty().withMessage('Name is required'),
  body('contactInfo.email').isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tourId, date, participants, contactInfo } = req.body;

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Check if group size is within limits
    if (participants > tour.maxGroupSize) {
      return res.status(400).json({ 
        message: `Maximum group size for this tour is ${tour.maxGroupSize}`
      });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      tour: tourId,
      date,
      user: req.user._id
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this tour on this date' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      date,
      participants,
      totalPrice: tour.price * participants,
      contactInfo
    });

    // Populate tour details before sending response
    await booking.populate('tour', 'name image location price duration');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking can be cancelled (e.g., not too close to start date)
    const startDate = new Date(booking.date);
    const now = new Date();
    const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilStart < 7) {
      return res.status(400).json({ 
        message: 'Bookings can only be cancelled at least 7 days before the start date'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 