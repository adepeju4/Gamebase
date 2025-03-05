import AuthRoute from './AuthRoute.js';
import { Router, Request, Response } from 'express';

const router = Router();

// Test endpoint to verify the server is working
router.get('/test', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Server is running!' });
});

router.use('/Auth', AuthRoute);

export default router;
