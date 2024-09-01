import { z } from 'zod';
import { Base64 } from 'js-base64';

export const submissionSchema = z.object({
  code: z.string().refine(Base64.isValid, 'Invalid Code'),
  language: z.string().min(1, 'Language is Required'),
});
