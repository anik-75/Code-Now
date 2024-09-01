import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  accessTokenExpiry,
  JWT_REF_SECRET,
  JWT_SECRET,
  refreshTokenExpiry,
  saltRounds,
} from '../config.js';

export const registerUser = async (
  email: string,
  password: string,
  username: string,
) => {
  try {
    const isUserPresent = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUserPresent) {
      throw new Error('User already Exists.');
    }

    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        username,
      },
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error + '');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not Found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Password is Incorrect');
    }

    const claims = {
      userId: user.id,
    };
    const accessToken = generateAccessToken(claims);
    const refreshTokenTimeLimit = new Date(Date.now() + refreshTokenExpiry);
    const refreshToken = generateRefreshToken(
      String(user.id),
      refreshTokenTimeLimit,
    );

    // save Refresh Token to DB
    const existingRefreshToken = await prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (existingRefreshToken) {
      // update token
      await prisma.refreshToken.update({
        where: {
          userId: user.id,
        },
        data: {
          token: refreshToken,
          expiryDate: refreshTokenTimeLimit,
          userId: user.id,
        },
      });
    } else {
      // create and Save token to DB
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          expiryDate: refreshTokenTimeLimit,
          userId: user.id,
        },
      });
    }

    return { refreshToken, accessToken };
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) throw new Error(error + '');
  }
};

export const verifyToken = (token: string): JwtPayload | null => {
  return jwt.verify(token, JWT_SECRET!) as JwtPayload;
};

export function generateAccessToken(claims: object) {
  return jwt.sign(claims, JWT_SECRET!, { expiresIn: accessTokenExpiry });
}

export function generateRefreshToken(userId: string, expiry: Date) {
  const expiresIn = Math.floor((expiry.getTime() - Date.now()) / 1000);
  return jwt.sign({ userId }, JWT_REF_SECRET!, { expiresIn });
}

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    const user = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!user) {
      throw new Error('Invalid Token.');
    }

    if (user.expiryDate < new Date()) {
      throw new Error('Refresh Token Expired.');
    }

    return user;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error + '');
  }
};
