const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'careerprep_secret_key_2024';

/**
 * Middleware to authenticate user using JWT token or fallback headers
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (err) {
        // Fall through to fallback logic if JWT verification fails
      }
    }

    // Fallback: extract user info from x-uid / x-email headers
    const uid = req.headers['x-uid'];
    const email = req.headers['x-email'];

    if (uid) {
      req.user = {
        uid: uid,
        email: email,
        isAdmin: false // Default fallback user is not admin
      };
      return next();
    }

    return res.status(401).json({ 
      success: false, 
      message: 'No token or valid user headers provided. Authorization denied.' 
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authentication.' 
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const authenticateAdmin = (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return;
    
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    
    next();
  });
};

/**
 * Optional authentication middleware
 * Attaches user info if token present, but allows request through without token
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (err) {
        // Token invalid, ignore
      }
    }

    // Check fallback headers
    const uid = req.headers['x-uid'];
    if (uid) {
      req.user = { uid, email: req.headers['x-email'], isAdmin: false };
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  authenticateAdmin,
  optionalAuth
};
