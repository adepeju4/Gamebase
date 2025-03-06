import { Router, Request, Response } from 'express';
import AuthController from '../controllers/UserController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

// Public routes (no authentication required)
router.post('/signup', AuthController.SignUp, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.user);
});

router.post('/login', AuthController.Login, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.user);
});

// Protected routes (authentication required)
router.use(authenticateToken);

// Get user profile
router.get('/profile', AuthController.getUserProfile, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.userProfile);
});

// Update user profile
router.put('/profile', AuthController.updateUserProfile, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.userProfile);
});

// Update user status
router.put('/status', AuthController.updateUserStatus, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.status);
});

export default router;
