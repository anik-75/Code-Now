import { z } from 'zod';
import { Difficulty } from '../types/problemtypes.js';

export const problemSchema = z.object({
  title: z.string().min(3, 'Title is Required'),
  description: z.string().min(3, 'Description is Required'),
  input: z.string().min(3, 'Input is Required'),
  output: z.string().min(3, 'Output is Required'),
  difficulty: z.enum([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard]),
});

export const updateProblemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  input: z.string().optional(),
  output: z.string().optional(),
  difficulty: z
    .enum([Difficulty.Easy, Difficulty.Medium, Difficulty.Hard])
    .optional(),
});
