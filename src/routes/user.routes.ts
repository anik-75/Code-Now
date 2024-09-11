import { Router } from 'express';
import {
  login,
  logout,
  refreshToken,
  register,
  validateUser,
} from '../controllers/userController.js';
import { authMiddleWare } from '../middlewares/authMiddleware.js';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/refresh', refreshToken);
userRouter.get('/validate', validateUser);
userRouter.post('/logout', authMiddleWare, logout);

export default userRouter;
