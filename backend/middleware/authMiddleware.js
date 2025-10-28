// import jwt from 'jsonwebtoken';

// export const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

//     const token = authHeader.split(' ')[1];
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     } catch (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//   };
// };



// backend/middleware/authMiddleware.js (UPGRADED)

import jwt from 'jsonwebtoken';

export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 🚨 CRITICAL UPGRADE: Check if essential data is in the token payload
      if (!decoded.email || !decoded.user_id || !decoded.role) {
          // Note: This check helps diagnose issues if the JWT was created incorrectly.
          return res.status(403).json({ message: 'Authentication error: Token payload is incomplete.' });
      }
      
      req.user = decoded; // Attach the full payload

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      }

      next();
    } catch (err) {
      // Handle expired, malformed, or invalid tokens
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };
};