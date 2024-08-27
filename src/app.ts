import express from 'express';
import { PORT } from './config.js';
import { health } from './health.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import { authMiddleWare } from './middlewares/authMiddleware.js';
import { Request, Response } from 'express';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health', health);
app.use('/auth', authRouter);
app.get('/protected', authMiddleWare, (req: Request, res: Response) => {
  res.status(200).json({
    userId: req?.userId,
  });
  return;
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
