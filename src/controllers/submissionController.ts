import { Request, Response } from 'express';
import { submissionSchema } from '../schemas/submissionSchema.js';
import prisma from '../prisma.js';
import executeCode from '../services/codeExecutionService.js';
import { createSubmission } from '../services/submissionService.js';

export const submitCode = async (req: Request, res: Response) => {
  try {
    const validatedData = submissionSchema.parse(req.body);
    const { code, language } = validatedData;
    const userId = req.userId;
    const submission = await createSubmission(code, language, userId!);
    const result = await executeCode(code, language);
    if (result) {
      await prisma.submission.update({
        where: { id: submission.id },
        data: { output: result },
      });
    }
    return res.status(200).json(result);
  } catch (error: any) {
    // error.message.split('\n').map((err) => console.log(err));
    if (error instanceof Error)
      res
        .status(400)
        .json({ error: error.message, message: 'Code execution failed.' });
    return;
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  const { submissionId } = req.params;

  try {
    const submission = await prisma.submission.findFirst({
      where: {
        id: Number(submissionId),
      },
    });
    res.status(200).json(submission);
    return;
  } catch (error) {
    if (error instanceof Error)
      res
        .status(400)
        .json({ error: error.message, message: 'Submission not Found.' });
    return;
  }
};
