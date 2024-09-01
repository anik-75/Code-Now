import prisma from '../prisma.js';

export const createSubmission = async (
  code: string,
  language: string,
  userId: string,
) => {
  try {
    const submission = await prisma.submission.create({
      data: {
        code: code,
        language: language,
        userId: Number(userId),
        output: '',
      },
    });
    return submission;
  } catch (error) {
    throw new Error('Failed to Create Submission');
  }
};
