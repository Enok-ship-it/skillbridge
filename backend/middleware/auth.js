// auth.js — This is a SECURITY GATE
// It checks if the user is logged in before allowing access to protected routes
// Think of it as a bouncer at a club checking ID cards

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get the token from the request header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Verify the token using our secret key
    // If the token is fake or expired, this will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request so routes can use it
    req.userId = decoded.userId;

    // next() passes control to the actual route handler
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = protect;