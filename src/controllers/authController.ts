import { NextFunction, Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import {
  generateAccessToken,
  loginUser,
  registerUser,
  verifyRefreshToken,
} from '../services/authService.js';
import { accessTokenExpiry, refreshTokenExpiry } from '../config.js';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, username } = validatedData;
    const user = await registerUser(email, password, username);
    const response = {
      id: user?.id,
      username: user?.username,
      email: user?.email,
    };
    res.status(201).json(response);
  } catch (error: unknown) {
    let errorMessage = 'Registration went wrong.';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).json(errorMessage);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const tokens = await loginUser(email, password);

    if (tokens?.accessToken) {
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        // TODO: Uncomment it
        // secure: true,
        sameSite: 'strict',
        maxAge: accessTokenExpiry,
      });
    }

    if (tokens?.refreshToken) {
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        // TODO: Uncomment it
        // secure: true,
        sameSite: 'strict',
        maxAge: refreshTokenExpiry,
      });
    }

    res.status(200).json({
      message: 'Login Successful',
    });
  } catch (error: unknown) {
    let errorMessage = 'Login Failed.';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(401).json(errorMessage);
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ error: 'Token not found. Login Again' });
    }
    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      throw new Error('Refresh Token Invalid.');
    }
    const claims = {
      userId: user.userId,
    };
    const accessToken = generateAccessToken(claims);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // TODO: Uncomment it
      // secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Refresh Token Successfully' });
  } catch (error: unknown) {
    let errorMessage = 'Login Again. Refreshing Token Failed.';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send(errorMessage);
    next(error);
  }
};
