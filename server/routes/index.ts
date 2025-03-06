import AuthRoute from './AuthRoute.js';
import ConversationRoutes from './ConversationRoutes.js';
import { Router, Request, Response } from 'express';

const router = Router();

// Test endpoint to verify the server is working
router.get('/test', (_: Request, res: Response) => {
  return res.status(200).json({ message: 'Server is running!' });
});

// Auth routes
router.use('/Auth', AuthRoute);

// Conversation and messaging routes
router.use('/conversations', ConversationRoutes);

export default router;
