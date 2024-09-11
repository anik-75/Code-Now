import { NextFunction, Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import {
  generateAccessToken,
  loginUser,
  registerUser,
  verifyRefreshToken,
  verifyToken,
} from '../services/userService.js';
import { accessTokenExpiry, refreshTokenExpiry } from '../config.js';
import prisma from '../prisma.js';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, username, role } = validatedData;
    await registerUser(email, password, username, role);
    return res.status(201).json('success');
  } catch (error: unknown) {
    let errorMessage = 'Registration went wrong.';
    if (error instanceof Error)
      res.status(500).json({ error: error.message, message: errorMessage });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const tokens = await loginUser(email, password);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (tokens?.accessToken) {
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        // TODO: secure
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

    return res.status(200).json({
      message: 'Login Successful',
      user: {
        email: user?.email,
        id: user?.id,
        username: user?.username,
      },
    });
  } catch (error: unknown) {
    let errorMessage = 'Login Failed.';
    if (error instanceof Error)
      res.status(401).json({ error: error.message, message: errorMessage });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
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

    return res.status(200).json({ message: 'Refresh Token Successfully' });
  } catch (error: unknown) {
    let errorMessage = 'Login Again. Refreshing Token Failed.';
    if (error instanceof Error)
      res.status(400).json({ error: error.message, message: errorMessage });
    return;
  }
};

export const validateUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    let accessTokenVerified = null;
    if (accessToken) {
      accessTokenVerified = verifyToken(accessToken);
    }

    if (accessTokenVerified) {
      return res.json({ isAuthenticated: true });
    } else {
      // refresh Token
      if (!refreshToken) {
        return res.status(401).json({
          error: 'Token not found. Login Again',
          isAuthenticated: false,
        });
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

      return res
        .status(200)
        .json({ message: 'Refresh Token Successfully', isAuthenticated: true });
    }
  } catch (error) {
    let errorMessage = 'Invalid Token.';
    if (error instanceof Error)
      res.status(400).json({
        error: error.message,
        message: errorMessage,
        isAuthenticated: false,
      });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  // remove token from db
  try {
    await prisma.refreshToken.delete({
      where: {
        token: req.cookies['refreshToken'],
      },
    });
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(200).json({
      message: 'logout successfully',
    });
  } catch (error) {
    let errorMessage = 'Logout failed';
    if (error instanceof Error)
      res.status(500).json({
        error: error.message,
        message: errorMessage,
        isAuthenticated: false,
      });
    return;
  }
};
