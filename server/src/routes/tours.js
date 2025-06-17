import express from 'express';
import { body, validationResult } from 'express-validator';
import Tour from '../models/Tour.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tours with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { search, location, sort, featured } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (featured) {
      query.featured = featured === 'true';
    }

    // Build sort
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const tours = await Tour.find(query).sort(sortOption);
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tour (admin only)
router.post('/', [
  protect,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('maxGroupSize').isInt({ min: 1 }).withMessage('Group size must be at least 1'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('image').trim().notEmpty().withMessage('Image URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tour (admin only)
router.put('/:id', [
  protect,
  authorize('admin'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('maxGroupSize').optional().isInt({ min: 1 }).withMessage('Group size must be at least 1'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tour (admin only)
router.delete('/:id', [protect, authorize('admin')], async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 