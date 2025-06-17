import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a tour name'],
    trim: true,
    maxlength: [100, 'Tour name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in days'],
    min: [1, 'Duration must be at least 1 day']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Please provide maximum group size'],
    min: [1, 'Group size must be at least 1']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'difficult'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['adventure', 'cultural', 'beach', 'mountain', 'city'],
    default: 'adventure'
  },
  startDates: [{
    type: Date
  }],
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for bookings
tourSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'tour'
});

// Index for search
tourSchema.index({ name: 'text', location: 'text' });

export default mongoose.model('Tour', tourSchema); 