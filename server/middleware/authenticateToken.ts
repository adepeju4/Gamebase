import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import User from '../models/Auth.js';

/**
 * Middleware to authenticate requests using JWT
 * Verifies the token and attaches user data to res.locals
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('authenticateToken middleware called for path:', req.path);

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader ? 'exists' : 'missing');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    console.log('Verifying token...');
    const decoded = verifyToken(token);

    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }

    console.log('Token verified, decoded payload:', decoded);

    // Find user in database
    console.log('Looking up user with userId:', decoded.userId);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    console.log('User found:', user.userName);

    // Update user's last active timestamp
    await User.updateOne({ userId: decoded.userId }, { lastActive: new Date() });

    // Attach user data to res.locals for use in route handlers
    res.locals.user = {
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    console.log('User data attached to res.locals:', res.locals.user);
    next();
  } catch (error) {
    console.error('Error in authenticateToken middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};
