import { Router } from 'express';
import {
  login,
  refreshToken,
  register,
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);

export default authRouter;
