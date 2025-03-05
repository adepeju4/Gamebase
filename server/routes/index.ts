import AuthRoute from './AuthRoute.js';
import { Router } from 'express';

const router = Router();

router.use('/Auth', AuthRoute);

export default router;
