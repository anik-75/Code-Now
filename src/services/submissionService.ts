import prisma from '../prisma.js';

export const createSubmission = async (
  code: string,
  language: string,
  userId: string,
  problemId: string,
) => {
  try {
    console.log(problemId);
    const submission = await prisma.submission.create({
      data: {
        code: code,
        language: language,
        userId: Number(userId),
        output: '',
        problemId: Number(problemId),
      },
    });
    return submission;
  } catch (error) {
    throw new Error('Failed to Create Submission');
  }
};
