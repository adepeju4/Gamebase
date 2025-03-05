import AuthRoute from './AuthRoute.ts';
import { Router } from 'express';

const router = Router();

router.use('/Auth', AuthRoute);

export default router;
