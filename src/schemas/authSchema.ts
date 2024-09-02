import { z } from 'zod';
import { Role } from '../types/userTypes.js';

export const registerSchema = z.object({
  email: z.string().min(3, 'Email is Required'),
  username: z.string().min(3, 'Username is Required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum([Role.User, Role.Admin]).optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is Required'),
  password: z.string().min(1, 'Password is Required'),
});
