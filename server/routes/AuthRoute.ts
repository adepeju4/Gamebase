import { Router, Request, Response } from 'express';
import AuthController from '../controllers/UserController.js';

const router = Router();

router.post('/signup', AuthController.SignUp, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.user);
});

// TODO: complete this with the right user object
router.post('/login', AuthController.Login, (_: Request, res: Response) => {
  return res.status(200).json(res.locals.user);
});

export default router;
