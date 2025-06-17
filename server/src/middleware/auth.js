import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Check if user is in session
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authorized, no session' });
    }

    // Get user from database
    const user = await User.findById(req.session.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
}; 