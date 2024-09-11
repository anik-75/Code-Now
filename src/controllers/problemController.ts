import { Request, Response } from 'express';
import slugify from 'slugify';
import prisma from '../prisma.js';
import {
  problemSchema,
  updateProblemSchema,
} from '../schemas/problemSchema.js';
import {
  saveProblem,
  update,
  deleteProblem,
  getProblemDetails,
  getAllProblemsDetails,
} from '../services/problemService.js';
import { uploadFile } from '../supabase/fileHandler.js';

export const getProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  try {
    const problem = await getProblemDetails(problemId);
    return res.status(200).json({ problem, message: 'success' });
  } catch (error) {
    return res.status(400).json({
      error,
      message: 'Problem Not Found.',
    });
  }
};

export const createProblem = async (req: Request, res: Response) => {
  try {
    const validatedData = problemSchema.parse(req.body);
    const { title, description, difficulty, input, output, correctCode } =
      validatedData;
    // @ts-ignore
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const inputMetaData = await uploadFile(input, 'Problems', `${slug}/input`);

    if (!inputMetaData) {
      throw new Error('Saving Input file failed.');
    }

    let inputFilePath;
    if (inputMetaData) {
      inputFilePath = inputMetaData.path;
    }

    const outputMetaData = await uploadFile(
      output,
      'Problems',
      `${slug}/output`,
    );

    if (!outputMetaData) {
      throw new Error('Saving Output file failed.');
    }

    let outputFilePath;
    if (outputMetaData) {
      outputFilePath = outputMetaData.path;
    }

    if (outputFilePath && inputFilePath) {
      await saveProblem({
        title,
        description,
        difficulty,
        inputFilePath,
        outputFilePath,
        slug,
        correctCode,
      });
    }
    return res.status(201).json('success');
  } catch (error) {
    let errorMessage = 'Creating Problem Failed.';
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message, message: errorMessage });
    }
    return res.status(500).json(errorMessage);
  }
};

export const updateProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;

  try {
    const validatedData = updateProblemSchema.parse(req.body);
    const { title, description, difficulty, input, output, correctCode } =
      validatedData;

    await update(Number(problemId), {
      title,
      description,
      difficulty,
      input,
      output,
      correctCode,
    });

    return res.status(200).json('updated successfully');
  } catch (error) {
    let errorMessage = 'Updating Problem Failed.';
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message, message: errorMessage });
    }
    return res.status(500).json(errorMessage);
  }
};

export const removeProblem = async (req: Request, res: Response) => {
  const problemId = req.params.problemId;
  try {
    await deleteProblem(Number(problemId));

    return res.status(204).end();
  } catch (error) {
    return res.status(400).json({
      error,
      message: 'Problem Not Found.',
    });
  }
};

export const getAllProblems = async (_req: Request, res: Response) => {
  try {
    const problems = await getAllProblemsDetails();
    return res.status(200).json({ problems, message: 'success' });
  } catch (error) {
    return res.status(400).json({
      error,
      message: 'Problem Not Found.',
    });
  }
};
