import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma.js';

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new Error('User Not Found');
    }

    if (user.role !== 'Admin') {
      throw new Error('Forbidden Access');
    }
    next();
  } catch (error) {
    res.status(500).json('Internal Server Error');
    next(error);
  }
};
