import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is an admin
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 