import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import User from '../models/Auth.js';

/**
 * Middleware to authenticate requests using JWT
 * Verifies the token and attaches user data to res.locals
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }

    // Find user in database

    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    await User.updateOne({ userId: decoded.userId }, { lastActive: new Date() });

    res.locals.user = {
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};
