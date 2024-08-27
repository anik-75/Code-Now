import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/authService.js';

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) {
      res.status(401).json({ error: 'Access Denied. Token not found.' });
      return;
    }

    const decoded = verifyToken(accessToken);
    req.userId = decoded?.userId;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
    next(error);
  }
};
