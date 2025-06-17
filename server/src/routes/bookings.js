const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { protect } = require('../middleware/auth');

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
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('numberOfPeople').isInt({ min: 1 }).withMessage('Number of people must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tourId, startDate, numberOfPeople } = req.body;

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Check if group size is within limits
    if (numberOfPeople > tour.maxGroupSize) {
      return res.status(400).json({ 
        message: `Maximum group size for this tour is ${tour.maxGroupSize}`
      });
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      tour: tourId,
      startDate,
      user: req.user._id
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this tour on this date' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      tour: tourId,
      startDate,
      numberOfPeople,
      totalPrice: tour.price * numberOfPeople
    });

    res.status(201).json(booking);
  } catch (error) {
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
    const startDate = new Date(booking.startDate);
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

module.exports = router; 