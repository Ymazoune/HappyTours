const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    // Get user from session
    const user = await User.findById(req.session.user._id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize }; 