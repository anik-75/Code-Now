import { Request, Response } from 'express';
import {
  runCodeSchema,
  submissionSchema,
} from '../schemas/submissionSchema.js';
import prisma from '../prisma.js';
import executeCode from '../services/codeExecutionService.js';
import { createSubmission } from '../services/submissionService.js';
import {
  getProblemCorrectCode,
  getProblemDetails,
} from '../services/problemService.js';
import { getInput, getOutput } from '../utils/helper.js';
import { submissionStatus } from '../types/problemtypes.js';

export const submitCode = async (req: Request, res: Response) => {
  let submission;
  try {
    const validatedData = submissionSchema.parse(req.body);
    const { code, language } = validatedData;

    const problemId = req.params.problemId;

    const userId = req.userId;
    const problem = await getProblemDetails(problemId);

    let input;
    if (problem) {
      input = await getInput(String(problem.input));
    }

    let output;
    if (problem) {
      output = await getOutput(String(problem.output));
    }
    submission = await createSubmission(code, language, userId!, problemId);

    const encodedInput = Buffer.from(String(input)).toString('base64');
    const result = await executeCode(code, encodedInput, language);

    // evaluate the user output with expected output
    const outputArr = output?.split('\n').join('').split('');
    const resultArr = result?.split('\n').join('').split('');

    let submissionState: submissionStatus = submissionStatus.Pending;
    if (JSON.stringify(outputArr) === JSON.stringify(resultArr)) {
      submissionState = submissionStatus.Correct;
    } else {
      submissionState = submissionStatus.Wrong;
    }

    await prisma.submission.update({
      where: { id: submission.id },
      data: { output: result, status: submissionState },
    });

    return res.status(200).json({
      result: result,
      submissionStatus: submissionState,
    });
  } catch (error: any) {
    if (submission) {
      await prisma.submission.update({
        where: { id: submission?.id },
        data: {
          output: error.message,
          status: submissionStatus.Wrong,
        },
      });
    }
    if (error instanceof Error) {
      res.status(200).json({
        error: error.message,
        submissionStatus: submission ? submissionStatus.Wrong : '',
      });
    }
    return;
  }
};

export const runCode = async (req: Request, res: Response) => {
  let correctCode;
  try {
    const validatedData = runCodeSchema.parse(req.body);
    const { code, language, input } = validatedData;

    const problemId = req.params.problemId;
    correctCode = await getProblemCorrectCode(problemId);

    // Run code for expected output for custom input
    const expectedOutput = await executeCode(
      String(correctCode),
      input,
      language,
    );

    // user code
    const userCodeOutput = await executeCode(code, input, language);

    // evaluate the user output with expected output
    const expectedOutputArr = expectedOutput?.split('\n').join('').split('');
    const userCodeOutputArr = userCodeOutput?.split('\n').join('').split('');

    let submissionState: submissionStatus = submissionStatus.Pending;
    if (
      JSON.stringify(expectedOutputArr) === JSON.stringify(userCodeOutputArr)
    ) {
      submissionState = submissionStatus.Correct;
    } else {
      submissionState = submissionStatus.Wrong;
    }

    return res.status(200).json({
      result: userCodeOutput,
      submissionStatus: submissionState,
    });
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(200).json({
        error: error.message,
        submissionStatus: correctCode ? submissionStatus.Wrong : '',
      });
    }
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
